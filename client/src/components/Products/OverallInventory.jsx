import "../../styles/Products/OverallInventory.css";
import { useState, useEffect } from "react";
import axios from "axios";

const OverallInventory = () => {
  const [summary, setSummary] = useState({
    categories: 0,
    totalProducts: 0,
    totalRevenue: 0,
    topSellingCount: 0,
    topSellingRevenue: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const fetchDashboardSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setSummary({
        categories: data.totalCategories,
        totalProducts: data.totalQuantity,
        totalRevenue: data.totalAmount,
        topProductsCount: data.topProductsCount || 0,
        topSellingRevenue: data.topRevenue || 0,
        lowStock: data.lowStock,
        outOfStock: data.outOfStock,
      });
    } catch (err) {
      console.error("Error fetching dashboard summary", err);
    }
  };

  useEffect(() => {
    fetchDashboardSummary();

    const handleUpdate = () => {
      fetchDashboardSummary();
    };

    window.addEventListener("productsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("productsUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="inventoryDashboard">
      <div className="section-inventory">
        <div className="categories">
          <h3 className="p-h3">Categories</h3>
          <p className="p-p1">{summary.categories}</p>
          <p className="p-p2">Last 7 days</p>
        </div>

        <div className="vertical-line"></div>

        <div className="totalProducts">
          <h3 className="p-h3">Total Products</h3>
          <div className="productValues">
            <div className="productCount">
              <p className="p-p1">{summary.totalProducts}</p>
              <p className="p-p2">Last 7 days</p>
            </div>
            <div className="revenueValue">
              <p className="p-p1">₹{summary.totalRevenue}</p>
              <p className="p-p2">Amount</p>
            </div>
          </div>
        </div>

        <div className="vertical-line"></div>

        <div className="topSelling">
          <h3 className="p-h3">Top Selling</h3>
          <div className="saleValues">
            <div className="saleCount">
              <p className="p-p1">{summary.topProductsCount}</p>
              <p className="p-p2">Last 7 days</p>
            </div>
            <div className="saleValue">
              <p className="p-p1">₹{summary.topSellingRevenue}</p>
              <p className="p-p2">Revenue</p>
            </div>
          </div>
        </div>

        <div className="vertical-line"></div>

        <div className="lowStocks">
          <h3 className="p-h3">Low Stocks</h3>
          <div className="stockValues">
            <div className="lowStockCount">
              <p className="p-p1">{summary.lowStock}</p>
              <p className="p-p2">Low Stock</p>
            </div>
            <div className="outOfStockCount">
              <p className="p-p1">{summary.outOfStock}</p>
              <p className="p-p2">Not in stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallInventory;
