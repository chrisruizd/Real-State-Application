import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png"

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData, cart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { user, logout } = useContext(AppContext);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    if (data && data.length > 0) {
      const fetchImagesAndUpdateProducts = async () => {
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            try {
              const response = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(response.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error(
                "Error fetching image for product ID:",
                product.id,
                error
              );
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(updatedProducts);
      };

      fetchImagesAndUpdateProducts();
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.state === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
      <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
      </h2>
    );
  }
  return (
    <>
      <div style={{ marginTop: "64px" /* matches navbar height */ }}>
        <div>
            {/* Greeting Section */}
          {user && (
            <div
              style={{
                padding: "7px 7px",  
                fontSize: "2.0rem",
                fontWeight: "700",
                textAlign: "center"
              }}
            >
              Welcome {user.fullName} 👋
            </div>
          )}
        </div>
          

        {/* Products Grid */}
        <div
          className="grid"
          style={{
            marginTop: "1px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            padding: "20px",
          }}
        >
          {filteredProducts.length === 0 ? (
            <h2
              className="text-center"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No Products Available
            </h2>
          ) : (
            filteredProducts.map((product) => {
              const { id, city, address, price, productAvailable, imageUrl } =
                product;
              const cardStyle = {
                width: "18rem",
                height: "12rem",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
                backgroundColor: productAvailable ? "#fff" : "#ccc",
              };
              return (
                <div
                  className="card mb-3"
                  style={{
                    width: "250px",
                    height: "360px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    overflow: "hidden", 
                    backgroundColor: productAvailable ? "#fff" : "#ccc",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:'flex-start',
                    alignItems:'stretch'
                  }}
                  key={id}
                >
                  <Link
                    to={`/product/${id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <img
                      src={imageUrl}
                      alt={address}
                      style={{
                        width: "100%",
                        height: "150px", 
                        objectFit: "cover",  
                        padding: "5px",
                        margin: "0",
                        borderRadius: "10px 10px 10px 10px", 
                      }}
                    />
                    <div
                      className="card-body"
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "10px",
                      }}
                    >
                      <div>
                        <h5
                          className="card-title"
                          style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                        >
                          {address.toUpperCase()}
                        </h5>
                        <i
                          className="card-brand"
                          style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                        >
                          {"~ " + city}
                        </i>
                      </div>
                      <hr className="hr-line" style={{ margin: "10px 0" }} />
                      <div className="home-cart-price">
                        <h5
                          className="card-text"
                          style={{ fontWeight: "500", fontSize: "1.0rem",marginBottom:'5px' }}
                        >
                          <p>Monthly Rent: ${price}</p>
                          
                        </h5>
                      </div>

                      {user?.role !== "ADMIN" && (
                        <button
                          className="btn-hover color-9"
                          style={{
                            margin: "10px 25px 0px",
                            backgroundColor: productAvailable ? "" : "gray",
                            cursor: productAvailable ? "pointer" : "not-allowed",
                            color: productAvailable ? "" : "#fff",
                            opacity: productAvailable ? 1 : 0.6,
                            pointerEvents: productAvailable ? "auto" : "none",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!user) {
                              // 👇 show message if not logged in
                              alert("Please log in or create an account to book a property.");
                              return;
                            }

                            // check if already in cart before adding
                            if (!cart.some((item) => item.id === product.id)) {
                              addToCart(product);
                            }
                          }}
                          disabled={!productAvailable}
                        >
                          {cart.some((item) => item.id === product.id)
                            ? "Selected 📌"
                            : productAvailable
                            ? "Book"
                            : "Unavailable"}
                        </button>
                      )}

                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
      
    </>
  );
};

export default Home;
