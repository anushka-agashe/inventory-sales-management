import OverallInventory from "../components/Products/OverallInventory";
import AddProductModal from "../components/Products/AddProductModal";
import AddProductForm from "../components/Products/AddProductForm";
import BulkProductUpload from "../components/Products/BulkProductUpload";
import Sidebar from "../components/Sidebar";
import ProductTable from "../components/Products/ProductTable";
import "../styles/Products/Products.css";
import searchImg from "../assets/icons/Search.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [showIndividualForm, setShowIndividualForm] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const navigate = useNavigate();

  const handleIndividualClick = () => {
    setShowModal(false);
    navigate("/products/add");
  };

  return (
    <div className="products-wrapper">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className={`rightHome-wrapper ${showModal ? "blurred" : ""}`}>
        <div className="titlebar">
          <h1 id="p-h1">Products</h1>
          <div className="searchbar">
            <div className="search-input-wrapper">
              <img
                src={searchImg}
                alt="search"
                className="search-icon"
              />
              <input
                id="inputsearch"
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <hr className="custom-line-6" />
        {/* <div className="section1"> */}
        <div className="overall-Inventory">
          <OverallInventory />
        </div>
        <div className="productTable">
          <ProductTable
            search={search}
            onAddProduct={() => setShowModal(true)}
          />
        </div>
      </div>
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onIndividualClick={handleIndividualClick}
          onBulkClick={() => {
          setShowModal(false);
           setShowBulkModal(true);
         }}
        />
      )}

{showBulkModal && (
      <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
         <div onClick={(e) => e.stopPropagation()}>
           <BulkProductUpload onClose={() => setShowBulkModal(false)} />
         </div>
       </div>
     )}

    </div>
  );
};

export default Products;
