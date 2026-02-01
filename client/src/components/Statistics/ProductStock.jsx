import "../../styles/Statistics/ProductStock.css";
import activity from "../../assets/icons/activity.png";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductStock = () => {
  const [stock, setStock] = useState(0);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/stats/statistics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setStock(res.data.productsInStock);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="productsStock">
      <div className="intro">
        <h2 className="titleName">Products In Stock</h2>
        <img className="icon" src={activity} alt="" />
      </div>
      <h1 className="fig">{stock.toLocaleString()}</h1>
      <p className="comment">+19% from last month</p>
    </div>
  );
};

export default ProductStock;
