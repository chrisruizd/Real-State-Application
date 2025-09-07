import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ScheduleDashboard.css';

const ScheduleDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/bookings/user", {
        withCredentials: true, // Send JSESSIONID cookie
        });

        console.log("Bookings data from backend:", res.data);

        const simplifiedBookings = Array.isArray(res.data)
          ? res.data.map(b => ({
              id: b.bookingId,
              name: `${b.propertyAddress}, ${b.propertyCity}, ${b.propertyState}`,
              tourDate: b.tourDate,
              status: b.status,
            }))
          : [];

        setBookings(simplifiedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please make sure you're logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="schedule-dashboard">Loading your scheduled tours...</p>;
  if (error) return <p className="schedule-dashboard">{error}</p>;
  if (bookings.length === 0) return <p className="schedule-dashboard">You have no scheduled tours.</p>;

  return (
    <div className="schedule-dashboard">
      <h2>Your Scheduled Property Tours</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id} style={{ marginBottom: '1rem' }}>
            <strong>Property:</strong> {booking.name} <br />
            <strong>Tour Date:</strong> {new Date(booking.tourDate).toLocaleString()} <br />
            <strong>Status:</strong> {booking.status || 'Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleDashboard;
