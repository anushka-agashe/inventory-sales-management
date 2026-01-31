import "../../styles/Home/TopProducts.css";
import { useState, useEffect } from "react";
import axios from "axios";

const TopProducts = () => {

  const [topProducts, setTopProducts] = useState([]);

  const fetchTopProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:4000/api/stats/summary",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
    // <div className="top-products">
    //   <h1 className="titleName">Top Products</h1>
    //   <div className="items-list">
    //     <div className="item">
    //       <h3 className="itemName">Product 1</h3>
    //       <img className="itemIcon" src="" alt="product1" />
    //     </div>
    //     <div className="item">
    //       <h3 className="itemName">Product 2</h3>
    //       <img className="itemIcon" src="" alt="product1" />
    //     </div>
    //     <div className="item">
    //       <h3 className="itemName">Product 3</h3>
    //       <img className="itemIcon" src="" alt="product1" />
    //     </div>
    //     <div className="item">
    //       <h3 className="itemName">Product 4</h3>
    //       <img className="itemIcon" src="" alt="product1" />
    //     </div>
    //     <div className="item">
    //       <h3 className="itemName">Product 5</h3>
    //       <img className="itemIcon" src="" alt="product1" />
    //     </div>
    //     <div className="item">
    //       <h3 className="itemName">Product 6</h3>
    //       <img className="itemIcon" src="" alt="product1" />
    //     </div>
    //   </div>
    // </div>
    <div className="top-products">
      <h1 className="titleName">Top Products</h1>
      <div className="items-list">
        {topProducts.length === 0 && <p>No top products available.</p>}
        {topProducts.map((product, index) => (
          <div className="item" key={index}>
            <h3 className="itemName">{product.name}</h3>
            {/* <img
              className="itemIcon"
              src={product.image || "/default-product.png"} // fallback image
              alt={product.name}
            /> */}
            
            <img
              className="itemIcon"
              src={
                product.image
                  ? `http://localhost:4000/${product.image}`
                  : "http://localhost:4000/default-product.png"
              }
              alt={product.name}
              onError={(e) => {
                e.target.src = "/default.png";
              }}
            />
            {/* <img
  className="itemIcon"
  src={
    product.image
      ? `http://localhost:4000/${product.image}`
      : "/default-product.png"
  }
  alt={product.name}
  onError={(e) => {
    console.log("IMAGE FAILED:", product.image);
    e.target.onerror = null;
    e.target.src = "/default-product.png";
  }}
/> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
