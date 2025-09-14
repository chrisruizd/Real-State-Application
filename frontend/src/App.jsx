import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import LandingPage from "./components/LandingPage";
import ScheduleDashboard from "./components/ScheduleDashboard";
import axios from 'axios';
import AdminBookingDashboard from './components/AdminBookingDashboard';
import AdminUsers from "./components/AdminUsers";
import UserDetails from "./components/UserDetails";
import AssignTenant from "./components/AssignTenant";
import TenantList from "./components/TenantList";
import MyAccount from "./components/MyAccount";
import TenantDetails from "./components/TenantDetails";

// ✅ Set Axios to include cookies with every request
axios.defaults.withCredentials = true;



function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar onSelectCategory={handleCategorySelect}
         />
        <Routes>
          

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/home"
            element={
              <Home addToCart={addToCart} selectedCategory={selectedCategory}
              />
            }
          />
          <Route path="/" element={<LandingPage />} />
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/product" element={<Product  />} />
          <Route path="product/:id" element={<Product  />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/update/:id" element={<UpdateProduct />} />

          <Route path="/schedule" element={<ScheduleDashboard />} />

          <Route path="/admin/bookings" element={<AdminBookingDashboard />} />
          
          
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />

          <Route path="/admin/assign-tenant/:userId?" element={<AssignTenant/>} />
          <Route path="/admin/tenants" element={<TenantList/>} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/admin/tenants/:id" element={<TenantDetails />} />


        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
