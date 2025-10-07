import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const AdminUsers = () => {
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, tenantsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/users", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
          axios.get("http://localhost:8080/api/tenants", {
            headers: { Authorization: `Bearer ${user?.token}` },
          }),
        ]);

        setUsers(usersRes.data);
        setTenants(tenantsRes.data);

        const statusMap = {};
        const today = new Date();

        for (const tenant of tenantsRes.data) {
          try {
            const res = await axios.get(
              `http://localhost:8080/api/payments/tenant/${tenant.id}`,
              { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            const payments = res.data || [];
            const unpaidPayments = payments.filter((p) => !p.paid);
            const paidPayments = payments.filter((p) => p.paid);

            if (payments.length === 0) {
              statusMap[tenant.id] = "No payments yet";
              continue;
            }

            if (unpaidPayments.length === 0) {
              statusMap[tenant.id] = "✅ All Paid";
              continue;
            }

            // Check if any unpaid payment is past due
            const hasLatePayment = unpaidPayments.some(
              (p) => new Date(p.dueDate) < today
            );

            if (hasLatePayment) {
              statusMap[tenant.id] = "⚠️ Late";
            } else {
              statusMap[tenant.id] = "🕓 Bill due";
            }

          } catch (err) {
            console.error(`Error fetching payments for tenant ${tenant.id}`, err);
            statusMap[tenant.id] = "Error fetching status";
          }
        }

        setPaymentStatus(statusMap);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) return <p className="loading">Loading users and tenants...</p>;

  const handleCreatePaymentsForAll = async () => {
    if (!window.confirm("Are you sure you want to create a new payment for ALL tenants?")) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/api/payments/create/all",
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      alert(res.data);
    } catch (err) {
      console.error("Error creating payments for all tenants:", err);
      alert("❌ Failed to create payments for all tenants.");
    }
  };


  return (
    <div className="main-content">
      {/* =================== Tenants Table =================== */}
      <div className="admin-container">
        <h2 className="admin-title">All Tenants</h2>

        <div className="admin-table-wrapper">
          {tenants.length === 0 ? (
            <p>No tenants found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tenant Name</th>
                  <th>Property</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.userFullName}</td>
                    <td>{t.productAddress}</td>
                    <td>{paymentStatus[t.id] || "Loading..."}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/admin/tenants/${t.id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn-payment"
                        onClick={() => navigate(`/admin/tenants/${t.id}/payments`)}
                      >
                        Payments
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <br />
        <button className="btn-generate-all" onClick={handleCreatePaymentsForAll}>
          💰 Generate Payments for All Tenants
        </button>
      </div>

      {/* =================== All Users Table =================== */}
      <div className="admin-container">
        <h2 className="admin-title">All Users</h2>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                    >
                      View Details
                    </button>
                    {u.role !== "TENANT" && (
                      <button
                        className="assign-btn"
                        onClick={() => navigate(`/admin/assign-tenant/${u.id}`)}
                      >
                        Assign Tenant Role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
