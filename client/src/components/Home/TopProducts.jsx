import "../../styles/Home/TopProducts.css";
import { useState, useEffect } from "react";
import axios from "axios";

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  const fetchTopProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTopProducts(res.data.topProducts || []);
    } catch (err) {
      console.error("Error fetching top products:", err);
    }
  };

  useEffect(() => {
    fetchTopProducts();

    const handleUpdate = () => {
      fetchTopProducts();
    };

    window.addEventListener("productsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("productsUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="top-products">
      <h1 className="titleName">Top Products</h1>
      <div className="items-list">
        {topProducts.length === 0 && <p>No top products available.</p>}
        {topProducts.map((product, index) => (
          <div className="item" key={index}>
            <h3 className="itemName">{product.name}</h3>

            <img
              className="itemIcon"
              src={
                product.image
                  ? `${import.meta.env.VITE_API_URL}/${product.image}`
                  : `${import.meta.env.VITE_API_URL}/default-product.png`
              }
              alt={product.name}
              onError={(e) => {
                e.target.src = "/default.png";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
