import "../../styles/Products/ProductTable.css";
import React, { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";
import BuyProduct from "./BuyProduct";
import axios from "axios";

const ProductTable = ({ search, onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const limit = 7;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:4000/api/products?search=${search}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowBuyModal(true);
  };

  const handleBuy = async (quantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/api/products/buy/${selectedProduct._id}`,
        { quantity: Number(quantity) },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(`Purchased ${quantity} units of ${selectedProduct.productName}`);
      setShowBuyModal(false);
      fetchProducts(); // Refresh table
      window.dispatchEvent(new Event("productsUpdated"));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Purchase failed");
    }
  };

  const handleBuySuccess = () => {
    fetchProducts(); // reload updated stock from backend
    window.dispatchEvent(new Event("productsUpdated"));
  };

  return (
    <>
      <div className="productTable">
        {/* {`productTable ${showModal ? "blurred" : ""}`} */}
        <div className="title-container">
          <h3 id="tableTitle">Products</h3>
          <button id="addProduct" onClick={onAddProduct}>
            Add Product
          </button>
        </div>

        <div className="productsList">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Expiry Date</th>
                <th>Availability</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(p)}
                    
                  >
                    <td>{p.productName}</td>
                    <td>₹{p.price}</td>
                    <td>
                      {p.quantity} {p.unit}
                    </td>
                    <td>{p.threshold}</td>
                    <td>
                      {p.expiryDate
                        ? new Date(p.expiryDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      {" "}
                      <span
                        style={{
                          fontWeight: "600",
                          color:
                            p.stockStatus === "In-stock"
                              ? "#43A047"
                              : p.stockStatus === "Low stock"
                                ? "#E19133"
                                : p.stockStatus === "Out of stock"
                                  ? "#D81B60"
                                  : "#000",
                        }}
                      >
                        {p.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="footer">
          <button
            id="prev"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <p id="pageNo">
            Page {page} of {totalPages}
          </p>
          <button
            id="next"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
      {/* BUY MODAL */}
      {showBuyModal && selectedProduct && (
        <BuyProduct
          product={selectedProduct}
          onClose={() => setShowBuyModal(false)}
          onBuy={handleBuy}
          onBuySuccess={handleBuySuccess}
        />
      )}
      {/* {showModal && <AddProductModal onClose={() => setShowModal(false)} />} */}
    </>
  );
};

export default ProductTable;
