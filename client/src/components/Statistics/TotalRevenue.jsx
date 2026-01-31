import "../../styles/Statistics/TotalRevenue.css";
import { useEffect, useState } from "react";
import axios from "axios";

const TotalRevenue = () => {
  const [revenue, setRevenue] = useState(0);
   useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/stats/statistics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRevenue(res.data.totalRevenue);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="totalRevenue">
      <div className="intro">
        <h2 className="titleName">Total Revenue</h2>
        <h2 className="titleName">₹</h2>
      </div>
      <h1 className="fig">₹ {revenue.toLocaleString()}</h1>
      <p className="comment">+20.1% from last month</p>
    </div>
  );
};

export default TotalRevenue;
