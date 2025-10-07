import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AppContext from "../Context/Context";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const { user } = useContext(AppContext);
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "TENANT") {
      navigate("/");
      return;
    }

    const fetchTenantInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/tenants/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
            withCredentials: true,
          }
        );
        const tenantData = res.data;
        setTenants(tenantData);

        // Fetch payments for each tenant
        const paymentMap = {};
        for (const tenant of tenantData) {
          const payRes = await axios.get(
            `http://localhost:8080/api/payments/tenant/${tenant.id}`,
            { headers: { Authorization: `Bearer ${user?.token}` } }
          );
          paymentMap[tenant.id] = payRes.data || [];
        }
        setPayments(paymentMap);
      } catch (err) {
        console.error("Error fetching tenant or payment info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantInfo();
  }, [user, navigate]);

  if (loading) return <p>Loading your account...</p>;

  return (
    <div className="main-content">
      <div className="account-container">
        <h2 className="account-title">My Account 🔑</h2>

        {tenants.length === 0 ? (
          <p>You are not currently assigned as a tenant.</p>
        ) : (
          tenants.map((t) => {
            const tenantPayments = payments[t.id] || [];
            const today = new Date();

            const unpaidPayments = tenantPayments.filter((p) => !p.paid);
            const upcomingPayment = unpaidPayments.length > 0 ? unpaidPayments[0] : null;

            const upcomingBills = tenantPayments.filter(
              (p) => !p.paid && new Date(p.dueDate) >= today
            );

            const paymentHistory = tenantPayments.filter((p) => p.paid);

            return (
                <div key={t.id} className="account-card">
                  <h3>🏡 {t.productAddress}</h3>
                  <p><strong>Tenant:</strong> {t.userFullName}</p>
                  <p><strong>Rent:</strong> ${t.rent}</p>
                  <p><strong>Deposit:</strong> ${t.deposit}</p>
                  <p><strong>Lease start date:</strong> {t.startDate}</p>
                  <p><strong>Lease end date:</strong> {t.endDate}</p>
                  <p><strong>Electricity included:</strong> {t.electricityFee ? "Yes" : "No"}</p>
                  <p><strong>Water included:</strong> {t.waterFee ? "Yes" : "No"}</p>
                  <p><strong>Number of household members:</strong> {t.numberTenants}</p>

                  <hr />
                  <hr />

                  {/* ========== Upcoming Bills Section ========== */}
                  <div className="payment-section">
                    <h4>📅 Upcoming Bills ({unpaidPayments.length})</h4>
                    {unpaidPayments.length === 0 ? (
                      <p>✅ No upcoming bills.</p>
                    ) : (
                      <table className="payment-table">
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {unpaidPayments.map((p) => (
                            <tr key={p.id}>
                              <td>${p.balance.toFixed(2)}</td>
                              <td>{p.dueDate}</td>
                              <td>{new Date(p.dueDate) < today ? "⚠️ Late" : "🕓 Due"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <small>ℹ️ Rent is due the 1st of each month</small>
                  </div>

                  {/* ========== Payment History Section ========== */}
                  <div className="payment-section">
                    <h4>💳 Payment History</h4>
                    {paymentHistory.length === 0 ? (
                      <p>No payment history yet.</p>
                    ) : (
                      <table className="payment-table">
                        <thead>
                          <tr>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Payment Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((p) => (
                            <tr key={p.id}>
                              <td>${p.balance.toFixed(2)}</td>
                              <td>{p.dueDate}</td>
                              <td>{p.paymentDate}</td>
                              <td>{p.paid ? "✅Paid" : "⚠️Due"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

            );
          })
        )}
      </div>
    </div>
  );
};

export default MyAccount;
