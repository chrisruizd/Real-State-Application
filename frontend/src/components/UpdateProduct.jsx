import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../Context/Context";


const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    address: "",
    city: "",
    state: "",
    price: "",
    description: "",
    availableDate: "",
    productAvailable: false,
  });
  const { user } = useContext(AppContext); // Make sure user has a 'role' property like 'ADMIN'
  const navigate = useNavigate();
  if (!user || user.role !== "ADMIN") {
    navigate("/"); // or navigate(`/product/${id}`)
    return null; // prevent any rendering
  }
  


  useEffect(() => {
    // Redirect non-admin users
    if (!user || user.role !== "ADMIN") {
      alert("Access denied. Only admins can update products.");
      navigate("/"); // or navigate(`/product/${id}`);
      return;
    }
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);

        // Fetch and set product image
        const responseImage = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
        const imageFile = await convertUrlToFile(responseImage.data, response.data.imageName);
        setImage(imageFile);

        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const convertUrlToFile = async (blobData, fileName) => {
    return new File([blobData], fileName, { type: blobData.type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await axios.put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label"><h6>Address</h6></label>
            <input
              type="text"
              className="form-control"
              value={updateProduct.address}
              onChange={handleChange}
              name="address"
              placeholder={product.address}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>City</h6></label>
            <input
              type="text"
              className="form-control"
              value={updateProduct.city}
              onChange={handleChange}
              name="city"
              placeholder={product.city}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>State</h6></label>
            <input
              type="text"
              className="form-control"
              value={updateProduct.state}
              onChange={handleChange}
              name="state"
              placeholder={product.state}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>Price</h6></label>
            <input
              type="number"
              className="form-control"
              value={updateProduct.price}
              onChange={handleChange}
              name="price"
              placeholder={product.price}
            />
          </div>
          <div className="col-12">
            <label className="form-label"><h6>Description</h6></label>
            <input
              type="text"
              className="form-control"
              value={updateProduct.description}
              onChange={handleChange}
              name="description"
              placeholder={product.description}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>Available Date</h6></label>
            <input
              type="date"
              className="form-control"
              value={updateProduct.availableDate}
              onChange={handleChange}
              name="availableDate"
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct((prev) => ({ ...prev, productAvailable: e.target.checked }))
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>
          <div className="col-md-8">
            <label className="form-label"><h6>Image</h6></label>
            <img
              src={image ? URL.createObjectURL(image) : "Image unavailable"}
              alt={product.imageName}
              style={{ width: "100%", height: "180px", objectFit: "cover", padding: "5px" }}
            />
            <input className="form-control" type="file" onChange={handleImageChange} />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
