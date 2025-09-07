import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER', // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/"); // redirect to login
      } else {
        const errorText = await response.text();
        setError(errorText || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred during signup.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup} noValidate>
        <h2 className="signup-title">Create Account</h2>

        <label htmlFor="name" className="form-label">Name</label>
        <input
          id="name"
          type="text"
          className="form-input"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
        />

        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          className="form-input"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          className="form-input"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <button type="submit" className="signup-button">Sign Up</button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default SignupPage;
