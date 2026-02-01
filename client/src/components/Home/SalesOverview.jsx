import sales from '../../assets/icons/Sales.png'
import revenue from '../../assets/icons/Revenue.png'
import profit from '../../assets/icons/Profit.png'
import cost from '../../assets/icons/Cost.png'
import '../../styles/Home/SalesOverview.css'

import { useEffect, useState } from "react";
import axios from "axios";

const SalesOverview = () => {

  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/invoices/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Sales stats error", err);
      }
    };

    fetchSalesStats();
  }, []);

  return (
    <div className='salesOverview'>
      <h1 className='titleName'>Sales Overview</h1>
      <div className="sales-container">
        <div className="sales-item">
          <img className='sales-icon' src={sales} alt="" />
          <p className='salesfig'>{stats.salesCount ?? 0}</p>
          <p className='subtitle'>Sales</p>
        </div>
        <div className="sales-item">
          <img className='sales-icon'  src={revenue} alt="" />
          <p className='salesfig'>₹ {stats.totalRevenue?.toLocaleString() ?? 0}</p>
          <p className='subtitle'>Revenue</p>
        </div>
        <div className="sales-item">
          <img className='sales-icon'  src={profit} alt="" />
          <p className='salesfig'>₹ 868</p>
          <p className='subtitle'>Profit</p>
        </div>
        <div className="sales-item">
          <img className='sales-icon'  src={cost} alt="" />
          <p className='salesfig'>₹ 17,432</p>
          <p className='subtitle'>Cost</p>
        </div>
      </div>
    </div>
  )
}

export default SalesOverview
