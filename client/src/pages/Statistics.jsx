import Sidebar from "../components/Sidebar.jsx"
import TotalRevenue from "../components/Statistics/TotalRevenue.jsx"
import ProductStock from "../components/Statistics/ProductStock.jsx"
import ProductsSold from "../components/Statistics/ProductsSold.jsx"
import SalesPurchase from "../components/Home/SalesPurchase.jsx"
import TopProducts from "../components/Home/TopProducts.jsx"
import '../styles/Statistics/Statistics.css'
import pieFrame from '../assets/images/pieFrame.png'
import settingsIcon from '../assets/icons/logo_setting.png'
import { Link } from "react-router-dom"

const Statistics = () => {
  return (
    <div className="statistics-wrapper">
      
       <div className="stat-mobile-header">
              <img id="st-piemobile" src={pieFrame} alt="Pie Frame" />
              <Link to="/settings">
                <img id="st-settings-mobile" src={settingsIcon} alt="Settings" />
              </Link>
            </div>

      <div className="stat-sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="stat-rightHome-wrapper">
        <h1 id="st-h1">Home</h1>
      <hr className="custom-line-6"/>
        <div className="stat-section1">
          <div className="totalRevenue">
            <TotalRevenue />
          </div>
          <div className="productsSold">
            <ProductsSold />
          </div>
           <div className="productsStock">
            <ProductStock />
          </div>
        </div>
        <div className="stat-section2">
          <div className="salesPurchase">
            < SalesPurchase/>
          </div>
          <div className="topProducts">
            <TopProducts />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
