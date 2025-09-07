import React from 'react';
import { useNavigate } from 'react-router-dom';
//import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <h1>Gradient Rental Properties</h1>
        <p>Find your perfect rental with ease and confidence.</p>
      </header>

      {/* About Section */}
      <main className="about-section">
        <h2>About Us</h2>
        <p>
          At Gradient Rental Properties, we simplify the rental experience by combining cutting-edge technology with personalized 
          service. As a landlord dedicated to providing the best experience, I built this plataform to simplify your experience
          as a tenant. This platform gives me full control while making it easy for you to book 
          tours, access leases, and submit maintenance requests—all in one place. My goal is to create a smooth and transparent 
          rental process, ensuring a positive experience at every step.
        </p>

        <button className="cta-button" onClick={goToHome}>
          See Available Properties
        </button>
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Gradient Rental Properties. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
