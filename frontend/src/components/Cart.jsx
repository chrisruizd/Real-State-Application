import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "axios";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [bookedItems, setBookedItems] = useState(new Set());
  const [tourDates, setTourDates] = useState({});
  const [bookedProperties, setBookedProperties] = useState([]);
  const {  user } = useContext(AppContext);
  const navigate = useNavigate();
  const userId = user.id; // Replace with actual logged-in user ID

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const backendProductIds = response.data.map(product => product.id);
        const updatedCartItems = cart.filter(item => backendProductIds.includes(item.id));

        const cartItemsWithImages = await Promise.all(
          updatedCartItems.map(async item => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${item.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...item, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...item, imageUrl: "placeholder-image-url" };
            }
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (!user || !user.id) {
      console.error("Error with logged in user credential");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/user/${user.id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          console.log("Multiple Booking")
          setBookedProperties(data);
        } else if (data) {
          console.log("Single Booking")
          setBookedProperties([data]); // wrap single object
        } else {
          setBookedProperties([]);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookedProperties([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();

    if (cart.length) {
      fetchCartItems();
    }
    // fetchBookedItems();
  }, [cart, user]);

  const handleContactLandlord = async (productId) => {
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0]; // yyyy-mm-dd

    try {
      await axios.post('http://localhost:8080/api/bookings', {
        productId: productId,
        tourDate: defaultDate,
      }, {
        withCredentials: true
      });
      //Remove the property from the cart
      handleRemoveFromCart(productId);

      //Re-fetch bookings
      const response = await fetch(
        `http://localhost:8080/api/bookings/user/${user.id}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setBookedProperties(data);
      } else if (data) {
        setBookedProperties([data]); // Wrap single booking
      } else {
        setBookedProperties([]);
      }

      // ✅ Optional: toast/alert to confirm booking
      alert("Your tour has been requested. You can check it in 'Already Booked'.");



    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data); // "You already booked this property"
      } else {
        alert("Error creating booking. Please try again.");
        console.error('Error creating booking:', error);
      }
    }
  };

  const handleDateChange = (itemId, date) => {
    setTourDates(prev => ({
      ...prev,
      [itemId]: date,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems(cartItems.filter(item => item.id !== itemId));
    setTourDates(prev => {
      const newDates = { ...prev };
      delete newDates[itemId];
      return newDates;
    });
  };

  return (
    <div className="cart-container">
      {/* Shopping Bag Section */}
      <div className="cart-section">
        <h2 className="section-title">🏡 Book a Tour</h2>
        {cartItems.length === 0 ? (
          <div className="empty">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
  
                <div className="cart-item-details">
                  <h4 className="cart-item-title">
                    {item.address}, {item.city}, {item.state}
                  </h4>
                  <p className="cart-item-price">Rent: ${item.price}</p>
  
                  <div className="cart-tour">
                    <label htmlFor={`tour-date-${item.id}`}>Select tour date: </label>
                    <input
                      type="date"
                      id={`tour-date-${item.id}`}
                      value={tourDates[item.id] || ""}
                      onChange={(e) => handleDateChange(item.id, e.target.value)}
                      disabled={bookedItems.has(item.id)}
                    />
                  </div>
  
                  <button
                    className="book-btn"
                    onClick={() => handleContactLandlord(item.id)}
                  >
                    Contact Landlord
                  </button>
                </div>
  
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
  
      {/* Already Booked Section */}
      <div className="cart-section">
        <h2 className="section-title">🗓️ Already Booked</h2>
        {bookedProperties.length === 0 ? (
          <div className="empty">
            <p>You have no booked properties yet.</p>
          </div>
        ) : (
          <ul className="cart-list">
            {bookedProperties.map((booking) => (
              <li key={booking.bookingId} className="booked-item">
                <h4>
                  {booking.address}, {booking.city}, {booking.state}
                </h4>
                <p><strong>Tour Date:</strong> {booking.tourDate}</p>
                <p><strong>Status:</strong> 
                  <span className={`status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
  
};

export default Cart;
