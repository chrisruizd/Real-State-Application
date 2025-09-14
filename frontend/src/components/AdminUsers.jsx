import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";


const AdminUsers = () => {
  const { user } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/admin/users", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  if (loading) return <p className="loading">Loading users...</p>;

  return (
    <div className="main-content">
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
                    <button
                        className="assign-btn"
                        onClick={() => navigate(`/admin/assign-tenant/${u.id}`)}
                        >
                        Assign Tenant Role
                    </button>
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
