import '../../styles/Statistics/ProductsSold.css'
import creditCard from '../../assets/icons/credit-card.png'
import { useEffect, useState } from "react";
import axios from "axios";

const ProductsSold = () => {
  const [sold, setSold] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/stats/statistics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSold(res.data.productsSold);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
      <div className="productsSold">
      <div className="intro">
        <h2 className="titleName">Products Sold</h2>
        <img className='icon' src={creditCard} alt="" />
      </div>
      <h1 className="fig">{sold.toLocaleString()}</h1>
      <p className="comment">+180.1% from last month</p>
    </div>
  )
}

export default ProductsSold
