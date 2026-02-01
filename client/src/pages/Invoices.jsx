import { useState } from "react";
import "../styles/Invoices/Invoices.css";
import Sidebar from "../components/Sidebar";
import OverallInvoice from "../components/Invoices/OverallInvoice";
import InvoiceTable from "../components/Invoices/InvoiceTable";
import searchImg from "../assets/icons/Search.png";
import { Link } from "react-router-dom";
import pieFrame from "../assets/images/pieFrame.png";
import settingsIcon from "../assets/icons/logo_setting.png";

const Invoices = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="invoices-wrapper">
      {/* ---------- MOBILE HEADER ---------- */}
      <div className="inv-mobile-header">
        <img id="piemobile" src={pieFrame} alt="Pie Frame" />
        <Link to="/settings">
          <img id="inv-settings-mobile" src={settingsIcon} alt="Settings" />
        </Link>
      </div>

      <div className="inv-sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="inv-rightHome-wrapper">
        <div className="titlebar">
          <h1 id="inv-h1">Invoice</h1>
          <div className="inv-searchbar">
            <div className="inv-search-input-wrapper">
              <img src={searchImg} alt="search" className="search-icon" />
              <input
                id="inv-inputsearch"
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
        <div className="overall-invoice">
          <OverallInvoice />
        </div>
        <div className="invoiceTable">
          <InvoiceTable search={search} />
        </div>
      </div>
    </div>
  );
};

export default Invoices;
