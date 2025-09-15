import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";


const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData, user } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (!user || user.role !== "ADMIN") {
      navigate("/"); // or navigate(`/product/${id}`)
      return null; // prevent any rendering
    }
    
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    if (!user || user.role !== "ADMIN") {
      alert("Access denied. Only admins can update products.");
      navigate("/"); // or navigate(`/product/${id}`);
      return;
    } else{
      navigate(`/product/update/${id}`);
    }
    
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };
  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }
  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName}
          style={{ width: "50%", height: "auto" }}
        />

        <div className="right-column" style={{ width: "50%" }}>
          <div className="product-description">
            <div style={{display:'flex',justifyContent:'space-between' }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>
              {product.state}
            </span>
            <p className="release-date" style={{ marginBottom: "2rem" }}>
              
              <h6>Listed : <span> <i> {new Date(product.availableDate).toLocaleDateString()}</i></span></h6>
              {/* <i> {new Date(product.releaseDate).toLocaleDateString()}</i> */}
            </p>
            </div>
            
           
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem",textTransform: 'capitalize', letterSpacing:'1px' }}>
              {product.address}
            </h1>
            <i style={{ marginBottom: "3rem" }}>{product.city}</i>
            <p style={{fontWeight:'bold',fontSize:'1rem',margin:'10px 0px 0px'}}>PRODUCT DESCRIPTION :</p>
            <p style={{ marginBottom: "1rem" }}>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Monthly Rent: {"$" + product.price}
            </span>
            {user?.role !== "ADMIN" && (
              <button
                className="btn-hover color-9"
                  style={{
                    margin: "10px 25px 0px",
                    backgroundColor: product.productAvailable ? "" : "gray",
                    cursor: product.productAvailable ? "pointer" : "not-allowed",
                    color: product.productAvailable ? "" : "#fff",
                    opacity: product.productAvailable ? 1 : 0.6,
                    pointerEvents: product.productAvailable ? "auto" : "none",
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
                  disabled={!product.productAvailable}
                >
                  {cart.some((item) => item.id === product.id)
                    ? "Selected 📌"
                    : product.productAvailable
                    ? "Book"
                    : "Unavailable"}
              </button>
            )}
            <h6 style={{ marginBottom: "1rem" }}>
              <i style={{ color: product.productAvailable ? "green" : "red", fontWeight: "bold" }}>
                {product.productAvailable ? "Property Available" : "Property Unavailable"}
              </i>
            </h6>


          
          </div>

          {user?.role === "ADMIN" && (
            <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleEditClick}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
              {/* <UpdateProduct product={product} onUpdate={handleUpdate} /> */}
              <button
                className="btn btn-primary"
                type="button"
                onClick={deleteProduct}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;