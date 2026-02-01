import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import pieFrame from "../assets/images/pieFrame.png";
import homeIcon from "../assets/icons/home_logo.png";
import productsIcon from "../assets/icons/icon_products.png";
import invoiceIcon from "../assets/icons/icon_invoice.png";
import statisticsIcon from "../assets/icons/icon_statistics.png";
import settingsIcon from "../assets/icons/logo_setting.png";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar-section">
      <img id="pie" src={pieFrame} alt="" />
      <hr className="custom-line-1" />
      <div className="contents">
        <div className="contents">
          <Link
            to="/home"
            className={`item ${location.pathname === "/home" ? "active" : ""}`}
          >
            <img className="icon" src={homeIcon} alt="" />
            <p className="title">Home</p>
          </Link>

          <Link
            to="/products"
            className={`item ${location.pathname === "/products" ? "active" : ""}`}
          >
            <img className="icon" src={productsIcon} alt="" />
            <p className="title">Products</p>
          </Link>

          <Link
            to="/invoices"
            className={`item ${location.pathname === "/invoices" ? "active" : ""}`}
          >
            <img className="icon" src={invoiceIcon} alt="" />
            <p className="title">Invoices</p>
          </Link>

          <Link
            to="/statistics"
            className={`item ${location.pathname === "/statistics" ? "active" : ""}`}
          >
            <img className="icon" src={statisticsIcon} alt="" />
            <p className="title">Statistics</p>
          </Link>
          <Link
            to="/settings"
            id="settings-link"
            className={`item ${location.pathname === "/settings" ? "active" : ""}`}
          >
            <img className="icon" src={settingsIcon} alt="" />
            <p className="title">Settings</p>
          </Link>

          {/* Settings (hidden on mobile) */}
          {/* <Link
    to="/settings"
    id="settings-link"
    className={`item ${location.pathname === "/settings" ? "active" : ""}`}
  >
    <img className="icon" src={settingsIcon} alt="" />
    <p className="title">Settings</p>
  </Link> */}
        </div>
      </div>

      <hr className="custom-line-2" />

      {/* <div className="user-container">
        <p>
          {user ? `${user.firstName}` : "User"}
        </p>
      </div> */}

      <div className="user-container">
        <div className="avatar-circle">
          {user
            ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
            : "U"}
        </div>
        <p className="username-text">
          {user ? `${user.firstName} ${user.lastName || ""}` : "User"}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
