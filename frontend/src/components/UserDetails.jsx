import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";


const UserDetails = () => {
  const { user } = useContext(AppContext);
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigate("/");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setUserDetails(res.data);
      } catch (err) {
        console.error("Error fetching user details", err);
      }
    };

    fetchUserDetails();
  }, [id, user, navigate]);

  if (!userDetails) return <p className="loading">Loading user details...</p>;

  return (
    <div className="main-content">
        <div className="admin-container">
        <h2 className="admin-title">User Details</h2>
        <div className="user-card">
            <p><strong>ID:</strong> {userDetails.id}</p>
            <p><strong>Full Name:</strong> {userDetails.fullName}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
        </div>
        <button className="btn-back" onClick={() => navigate(-1)}>
            ← Back
        </button>
        </div>
    </div>
  );
};

export default UserDetails;
