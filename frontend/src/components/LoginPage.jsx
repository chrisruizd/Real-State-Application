import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from "../Context/Context";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AppContext);

  const handleLogin = async (e) => {
  e.preventDefault();

  // Basic client-side validation
  if (!loginEmail || !loginPassword) {
    setErrorMessage("Email and password are required.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // allows cookies if needed
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    // Check if response is okay
    if (response.ok) {
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        // If JSON response, parse it
        const data = await response.json();
        login(data); // stores user in context
        console.log("Login successful, redirecting to /home"); 
        navigate("/home"); // redirect after login
      } else {
        // If it's plain text (e.g., "Login successful"), handle it
        const successMessage = await response.text();
        setErrorMessage(successMessage || "Login failed. Please check your credentials.");
      }
    } else {
      const errorText = await response.text();
      setErrorMessage(errorText || "Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error); // For debugging
    setErrorMessage("An error occurred. Please try again.");
  }
};


return (
  <div className="login-container">
    <form className="login-form" onSubmit={handleLogin} noValidate>
      <h2 className="login-title">Welcome Back</h2>
      <label htmlFor="email" className="form-label">Email</label>
      <input
        id="email"
        type="email"
        className="form-input"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <label htmlFor="password" className="form-label">Password</label>
      <input
        id="password"
        type="password"
        className="form-input"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
      <button type="submit" className="login-button">Login</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  </div>
);
};

export default LoginPage;
