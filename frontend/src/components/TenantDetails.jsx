import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const TenantDetails = () => {
  const { id } = useParams(); // tenantId from URL
  const { user } = useContext(AppContext);
  const [tenant, setTenant] = useState(null);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/tenants/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setTenant(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching tenant", err);
      }
    };
    fetchTenant();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/tenants/${id}`, form, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      alert("Tenant updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Error updating tenant", err);
      alert("Failed to update tenant.");
    }
  };

  if (!tenant) return <p>Loading tenant details...</p>;

  return (
    <div className="main-content">
        <div className="tenant-details">
        <h2>Tenant Details</h2>
        <p><strong>Name:</strong> {tenant.userFullName}</p>
        <p><strong>User ID:</strong> {tenant.userId}</p>
        <p><strong>Property:</strong> {tenant.productAddress}</p>

        <form className="tenant-form" onSubmit={handleSubmit}>
            <label>
            Rent:
            <input type="number" name="rent" value={form.rent || ""} onChange={handleChange} />
            </label>
            <label>
            Deposit:
            <input type="number" name="deposit" value={form.deposit || ""} onChange={handleChange} />
            </label>
            <label>
            Start Date:
            <input type="date" name="startDate" value={form.startDate || ""} onChange={handleChange} />
            </label>
            <label>
            End Date:
            <input type="date" name="endDate" value={form.endDate || ""} onChange={handleChange} />
            </label>
            <label>
            Electricity Fee:
            <input type="checkbox" name="electricityFee" checked={form.electricityFee || false} onChange={handleChange} />
            </label>
            <label>
            Water Fee:
            <input type="checkbox" name="waterFee" checked={form.waterFee || false} onChange={handleChange} />
            </label>
            <label>
            Number of Tenants:
            <input type="number" name="numberTenants" value={form.numberTenants || ""} onChange={handleChange} />
            </label>
            <button type="submit" className="update-btn">Update Tenant</button>
        </form>
        </div>
    </div>
  );
};

export default TenantDetails;
