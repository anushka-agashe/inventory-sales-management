import quantity from "../../assets/icons/Quantity.png";
import takeaway from "../../assets/icons/Ontheway.png";
import "../../styles/Home/InventorySummary.css";
import { useEffect, useState } from "react";
import axios from "axios";

const InventorySummary = () => {
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:4000/api/products/inventory-summary",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setInventory(res.data);
      } catch (err) {
        console.error("Inventory fetch error", err);
      }
    };

    fetchInventory();
  }, []);
  return (
    <div className="inventorySummary">
      <h1 className="titleName">Inventory Summary</h1>
      <div className="inventory-container">
        <div className="inventory-item">
          <img className="inventory-icon" src={quantity} alt="" />
          <p className="inventoryfig">{inventory.totalStock ?? 0}</p>
          <p className="subtitle">In Stock</p>
        </div>
        <div className="inventory-item">
          <img className="inventory-icon" src={takeaway} alt="" />
          <p className="inventoryfig">200</p>
          <p className="subtitle">To be received</p>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
