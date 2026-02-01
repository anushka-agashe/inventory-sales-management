import "../../styles/Home/ProductSummary.css";
import suppliers from "../../assets/icons/Suppliers.png";
import categories from "../../assets/icons/Categories.png";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductSummary = () => {
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProductSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/product-summary`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Product summary error", err);
      }
    };

    fetchProductSummary();
  }, []);

  return (
    <div className="productSummary">
      <h1 className="titleName">Product Summary</h1>
      <div className="product-container">
        <div className="product-item">
          <img className="product-icon" src={suppliers} alt="" />
          <p className="productfig">31</p>
          <p className="subtitle">Number of Suppliers</p>
        </div>
        <div className="product-item">
          <img className="product-icon" src={categories} alt="" />
          <p className="product">{product.categoryCount ?? 0}</p>
          <p className="subtitle">Number of Categories</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
