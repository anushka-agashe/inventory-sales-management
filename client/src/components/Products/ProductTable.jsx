import "../../styles/Products/ProductTable.css";
import React, { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";
import BuyProduct from "./BuyProduct";
import axios from "axios";
import infro from "../../assets/icons/Info.png";

const ProductTable = ({ search, onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const items_limit = 7;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [page, search, isMobile]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({ search });

      if (!isMobile) {
        params.append("page", page);
        params.append("limit", items_limit);
      }

      const res = await fetch(
        `http://localhost:4000/api/products?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();

      setProducts(data.products || []);

      if (isMobile) {
        // setProducts(data.products);
        setTotalPages(1);
      } else {
        // setProducts(data.products);
        setTotalPages(Math.ceil(data.total / items_limit));
      }
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleRowClick = (product) => {
    if (isMobile) return;
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
        <div className="title-container">
          <h3 id="tableTitle">Products</h3>
          <button id="addProduct" onClick={onAddProduct}>
            Add Product
          </button>
        </div>

        <div className="productsList">
          <div className="table-responsive-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>

                  {!isMobile && (
                    <>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Threshold</th>
                      <th>Expiry Date</th>
                    </>
                  )}

                  <th>Availability</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isMobile ? 2 : 6}
                      style={{ textAlign: "center" }}
                    >
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p._id}
                      onClick={!isMobile ? () => handleRowClick(p) : undefined}
                    >
                      <td>{p.productName}</td>

                      {!isMobile && (
                        <>
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
                        </>
                      )}

                      <td>
                        <div className="availability-cell">
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

                          {isMobile && (
                            <button
                              className="info-btn"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent row click
                                setSelectedProduct(p);
                                setShowBuyModal(true);
                              }}
                            >
                              <img src={infro} alt="info" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isMobile && (
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
        )}
      </div>

      {showBuyModal && selectedProduct && (
        <BuyProduct
          product={selectedProduct}
          onClose={() => setShowBuyModal(false)}
          onBuy={handleBuy}
          onBuySuccess={handleBuySuccess}
        />
      )}

      {isMobile && (
        <button className="floating-add-btn" onClick={onAddProduct}>
          Add Product
        </button>
      )}
    </>
  );
};

export default ProductTable;
