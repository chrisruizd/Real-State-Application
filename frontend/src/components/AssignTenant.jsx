import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const AssignTenant = () => {
  const { user } = useContext(AppContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    rent: "",
    deposit: "",
    startDate: "",
    endDate: "",
    electricityFee: false,
    waterFee: false,
    numberTenants: 1,
  });

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:8080/api/tenants/assign/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      alert("Tenant assigned successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Error assigning tenant:", err);
      alert("Failed to assign tenant.");
    }
  };

  return (
    <div className="main-content">
      <div className="admin-container">
        <h2 className="admin-title">Assign Tenant Role</h2>
        <form className="tenant-form" onSubmit={handleSubmit}>
          <label>
            Select Property:
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.address}, {p.city}, {p.state}
                </option>
              ))}
            </select>
          </label>

          <label>
            Rent:
            <input
              type="number"
              name="rent"
              value={form.rent}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Deposit:
            <input
              type="number"
              name="deposit"
              value={form.deposit}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Start Date:
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Electricity Fee:
            <input
              type="checkbox"
              name="electricityFee"
              checked={form.electricityFee}
              onChange={handleChange}
            />
          </label>

          <label>
            Water Fee:
            <input
              type="checkbox"
              name="waterFee"
              checked={form.waterFee}
              onChange={handleChange}
            />
          </label>

          <label>
            Number of Tenants:
            <input
              type="number"
              name="numberTenants"
              min="1"
              value={form.numberTenants}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="btn-submit">
            Save Tenant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignTenant;
