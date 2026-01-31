import "../../styles/Products/AddProductForm.css";
import Sidebar from '../Sidebar.jsx'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
  

const AddProductForm = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    productId: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    threshold: "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.productName.trim()) errs.productName = "Required";
    if (!formData.category.trim()) errs.category = "Required";
    if (!formData.price) errs.price = "Required";
    if (!formData.quantity) errs.quantity = "Required";
    if (!formData.unit.trim()) errs.unit = "Required";
    if (!formData.threshold) errs.threshold = "Required";
    if (!imageFile) errs.image = "Image required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      //   Object.keys(formData).forEach((key) => {
      //     if (key !== "image") data.append(key, formData[key]);
      //   });

      data.append("productName", formData.productName);
      data.append("productId", formData.productId || "");
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      data.append("unit", formData.unit);
      data.append("expiryDate", formData.expiryDate || "");
      data.append("threshold", formData.threshold);
      data.append("file", imageFile);

      const res = await axios.post("http://localhost:4000/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          //   "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="addProductPage">
      <div className="sidebar-wrapper">
              <Sidebar />
       </div>
       <div className="rightHome-wrapper">
        <h1 id="h-h1">Product</h1>
      <hr className="custom-line-6"/>
      <div className="createLink">
        <h2 className="h-h2">Add Product</h2>
        <h2 className="h-h2"> &gt;</h2>
        <h2 className="h-h2">Individual Product</h2>
      </div>
      <form className="productForm" onSubmit={handleSubmit}>
        {/* Image Upload */}

        <div className="imageUploadSection">
          <div className="imagePreviewBox">
            {imagePreview && <img src={imagePreview} alt="Preview" />}
          </div>

          <div className="uploadTextBlock">
            <p>Drag image here</p>
            <p className="orText">or</p>
            <label className="browseText">
              Browse image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
            {errors.image && <span className="error">{errors.image}</span>}
          </div>
        </div>
        <div className="formFields">
          <div className="formRow">
            <label className="label">Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleChange}
            />
            {errors.productName && (
              <span className="error">{errors.productName}</span>
            )}
          </div>

          <div className="formRow">
            <label className="label">Product ID</label>
            <input
              type="text"
              name="productId"
              placeholder="Enter product ID"
              value={formData.productId || ""}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label className="label">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Select product category"
              value={formData.category}
              onChange={handleChange}
            />
            {errors.category && (
              <span className="error">{errors.category}</span>
            )}
          </div>

          <div className="formRow">
            <label className="label">Price</label>
            <input
              type="text"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>

          <div className="formRow">
            <label className="label">Quantity</label>
            <input
              type="text"
              name="quantity"
              placeholder="Enter product quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            {errors.quantity && (
              <span className="error">{errors.quantity}</span>
            )}
          </div>

          <div className="formRow">
            <label className="label">Unit</label>
            <input
              type="text"
              name="unit"
              placeholder="Enter product unit"
              value={formData.unit}
              onChange={handleChange}
            />
            {errors.unit && <span className="error">{errors.unit}</span>}
          </div>

          <div className="formRow">
            <label className="label">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              placeholder="Enter expiry date"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label className="label">Threshold Value</label>
            <input
              type="text"
              name="threshold"
              placeholder="Enter threshold value"
              value={formData.threshold}
              onChange={handleChange}
            />
            {errors.threshold && (
              <span className="error">{errors.threshold}</span>
            )}
          </div>
        </div>
        <div className="formActions">
          <button
            type="button"
            className="discardBtn"
            onClick={() => navigate("/products")}
          >
            Discard
          </button>
          <button type="submit" className="addBtn">
            Add Product
          </button>
        </div>
        {/* </div> */}
      </form>
      </div>
    </div>
  );
};

export default AddProductForm;
