import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    address: "",
    city: "",
    description: "",
    price: "",
    state: "",
    availableDate: "",
    productAvailable: false,
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    
    // Append product data
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    // Append image only if selected
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:8080/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  return (
    <div className="container">
      <div className="center-container">
        <form className="row g-3 pt-5" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label"><h6>Address</h6></label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Address"
              onChange={handleInputChange}
              value={product.address}
              name="address"  // ✅ Corrected name
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>City</h6></label>
            <input
              type="text"
              name="city"  // ✅ Corrected name
              className="form-control"
              placeholder="Enter city"
              value={product.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12">
            <label className="form-label"><h6>Description</h6></label>
            <input
              type="text"
              className="form-control"
              placeholder="Add product description"
              value={product.description}
              name="description"
              onChange={handleInputChange}
            />
          </div>
          <div className="col-5">
            <label className="form-label"><h6>Price</h6></label>
            <input
              type="number"
              className="form-control"
              placeholder="Eg: $1000"
              onChange={handleInputChange}
              value={product.price}
              name="price"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label"><h6>State</h6></label>
            <select
              className="form-select"
              value={product.state}
              onChange={handleInputChange}
              name="state"  // ✅ Corrected name
            >
              <option value="">Select State</option>
              <option value="NY">New York</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="IL">Illinois</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label"><h6>Available Date</h6></label>
            <input
              type="date"
              className="form-control"
              value={product.availableDate}
              name="availableDate"  // ✅ Corrected name
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label"><h6>Image</h6></label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, productAvailable: e.target.checked }))
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
