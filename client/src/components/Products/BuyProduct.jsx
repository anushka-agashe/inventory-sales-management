import "../../styles/Products/BuyProduct.css";
import { useState } from "react";
import axios from "axios";

const BuyProduct = ({ product, onClose, onBuySuccess }) => {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      return setError("Enter a valid quantity");
    }

    if (qty > product.quantity) {
      return setError("Not enough stock available");
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/buy/${product._id}`,
        { quantity: qty },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      onBuySuccess(); // refresh table
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="buyProductOverlay" onClick={onClose}>
      <div className="buyProductModal" onClick={(e) => e.stopPropagation()}>
        <div className="buyDiv">
          <h2>Simulate Buy Product</h2>
        </div>
        <input
          className="buyInput"
          type="text"
          name="quantity"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="buyBtn" onClick={handleBuy} disabled={loading}>
          {loading ? "Processing..." : "Buy"}
        </button>
      </div>
    </div>
  );
};

export default BuyProduct;
