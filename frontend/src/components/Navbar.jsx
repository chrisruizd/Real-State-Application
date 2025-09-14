import React, { useEffect, useState } from "react";
import Home from "./Home"
import axios from "axios";
// import { json } from "react-router-dom";
// import { BiSunFill, BiMoon } from "react-icons/bi";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";



const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults,setShowSearchResults] = useState(false)
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true)
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search?keyword=${value}`
      );
      setSearchResults(response.data);
      setNoResults(response.data.length === 0);
      console.log(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  
  // const handleChange = async (value) => {
  //   setInput(value);
  //   if (value.length >= 1) {
  //     setShowSearchResults(true);
  //     try {
  //       let response;
  //       if (!isNaN(value)) {
  //         // Input is a number, search by ID
  //         response = await axios.get(`http://localhost:8080/api/products/search?id=${value}`);
  //       } else {
  //         // Input is not a number, search by keyword
  //         response = await axios.get(`http://localhost:8080/api/products/search?keyword=${value}`);
  //       }

  //       const results = response.data;
  //       setSearchResults(results);
  //       setNoResults(results.length === 0);
  //       console.log(results);
  //     } catch (error) {
  //       console.error("Error searching:", error.response ? error.response.data : error.message);
  //     }
  //   } else {
  //     setShowSearchResults(false);
  //     setSearchResults([]);
  //     setNoResults(false);
  //   }
  // };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Single Family Home",
    "Condo",
    "Townhome",
    "Mobile Home",
    "Multi Family Home",
  ];
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top"
          style={{
            background: "linear-gradient(45deg,rgb(235, 210, 101),rgb(252, 175, 11),rgb(211, 157, 9))",
            padding: "4px 15px",
            borderRadius: "5px",
            boxShadow: "0px 4px 10px rgba(255, 215, 0, 0.5)"
          }}
        >
          <div className="container-fluid">
            <a
              className="navbar-brand"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Gradient
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                {user ? ( //User Authenticated
                  <>
                    {/* Tenant */}
                    {user?.role === "TENANT" && (
                      <>
                        <li className="nav-item">
                          <a className="nav-link active" aria-current="page" href="/my-account">
                            My Account
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link active" aria-current="page" href="home">
                            Maintainance History
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link active" aria-current="page" href="home">
                            Announcements
                          </a>
                        </li>
                      </>
                    )}

                    <li className="nav-item">
                      <a className="nav-link active" aria-current="page" href="/home">
                        Dashboard
                      </a>
                    </li>

                    {/* Admin */}
                    {user?.role === "ADMIN" && (
                      <>
                        <li className="nav-item">
                          <a className="nav-link" href="/add_product">
                            Add Property
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="/admin/users">
                            Manage Users
                          </a>
                        </li>
                      </>
                    )}

                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="/"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Property Type
                      </a>

                      <ul className="dropdown-menu">
                        {categories.map((category) => (
                          <li key={category}>
                            <button
                              className="dropdown-item"
                              onClick={() => handleCategorySelect(category)}
                            >
                              {category}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link btn btn-link" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </>
                 
                ) : ( //User Not Authenticated
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/signup">Sign Up</Link>
                    </li>
                  </>
                )}


                

                

                <li className="nav-item"></li>
              </ul>





              <button className="theme-btn" onClick={() => toggleTheme()}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>

              <div className="d-flex align-items-center cart">
                {/* Conditional Booking Link */}
                {user && (
                  <Link
                    to={user?.role === "ADMIN" ? "/admin/bookings" : "/cart"}
                    className="nav-link text-dark"
                  >
                    <i
                      className="bi bi-cart me-2"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      Bookings
                    </i>
                  </Link>
                )}

                
                {/* <form className="d-flex" role="search" onSubmit={handleSearch} id="searchForm"> */}
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)} // Set searchFocused to true when search bar is focused
                  onBlur={() => setSearchFocused(false)} // Set searchFocused to false when search bar loses focus
                />
                {showSearchResults && (
                  <ul className="list-group">
                    {searchResults.length > 0 ? (  
                        searchResults.map((result) => (
                          <li key={result.id} className="list-group-item">
                            <a href={`/product/${result.id}`} className="search-result-link">
                            <span>{result.address}</span>
                            </a>
                          </li>
                        ))
                    ) : (
                      noResults && (
                        <p className="no-results-message">
                          No Prouduct with such Address
                        </p>
                      )
                    )}
                  </ul>
                )}
                {/* <button
                  className="btn btn-outline-success"
                  onClick={handleSearch}
                >
                  Search Products
                </button> */}
                {/* </form> */}
                <div />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
