import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AppContext from "../Context/Context";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const { user } = useContext(AppContext);
  const [tenants, setTenants] = useState([]);
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
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );
        setTenants(res.data);
      } catch (err) {
        console.error("Error fetching tenant info:", err);
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
          tenants.map((t) => (
            <div key={t.id} className="account-card">
              <h3>🏡{t.productAddress}</h3> <br />
              <p><strong>Tenant:</strong> {t.userFullName}</p>
              <p><strong>Rent:</strong> ${t.rent}</p>
              <p><strong>Deposit:</strong> ${t.deposit}</p>
              <p><strong>Lease start date:</strong> {t.startDate}</p>
              <p><strong>Lease end date:</strong> {t.endDate}</p>
              <p><strong>Electricity included:</strong> {t.electricityFee ? "Yes" : "No"}</p>
              <p><strong>Water included:</strong> {t.waterFee ? "Yes" : "No"}</p>
              <p><strong>Number of household members:</strong> {t.numberTenants}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAccount;
