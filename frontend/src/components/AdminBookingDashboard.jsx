import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminBookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/bookings');

      // Ensure the data is an array before setting it
      const data = Array.isArray(response.data) ? response.data : [];
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setBookings([]); // fallback to empty list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Tour Requests</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td className="border p-2">{booking.fullName}</td>
                <td className="border p-2">{booking.email}</td>
                <td className="border p-2">
                  {booking.address}, {booking.city}, {booking.state}
                </td>
                <td className="border p-2">{booking.tourDate}</td>
                <td className="border p-2">{booking.status}</td>
                <td className="border p-2">
                  {booking.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.bookingId, 'APPROVED')}
                        className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(booking.bookingId, 'CANCELED')}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status !== 'PENDING' && (
                    <span className="text-gray-500">{booking.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  async function updateStatus(bookingId, newStatus) {
    try {
        await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status`, null, {
            params: { status: newStatus }, // goes into query string
            withCredentials: true, // only needed if you're using cookies for auth
          });
      fetchBookings(); // refresh list
    } catch (err) {
      console.error(`Error updating status:`, err);
    }
  }
};

export default AdminBookingDashboard;
