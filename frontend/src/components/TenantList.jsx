// TenantList.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const TenantList = () => {
  const { user } = useContext(AppContext);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    const fetch = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/tenants", { withCredentials: true });
        setTenants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, navigate]);

  if (loading) return <div className="tenant-loading">Loading...</div>;

  return (
    <div className="tenant-page">
      <div className="tenant-card">
        <h2>Tenants</h2>
        <table className="tenant-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Property</th>
              <th>Rent</th>
              <th>Deposit</th>
              <th>Start</th>
              <th>End</th>
              <th>Tenants</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.userFullName} ({t.userId})</td>
                <td>{t.productAddress} ({t.productId})</td>
                <td>{t.rent}</td>
                <td>{t.deposit}</td>
                <td>{t.startDate}</td>
                <td>{t.endDate}</td>
                <td>{t.numberTenants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantList;
