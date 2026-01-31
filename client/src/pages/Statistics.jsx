import Sidebar from "../components/Sidebar.jsx"
import TotalRevenue from "../components/Statistics/TotalRevenue.jsx"
import ProductStock from "../components/Statistics/ProductStock.jsx"
import ProductsSold from "../components/Statistics/ProductsSold.jsx"
import SalesPurchase from "../components/Home/SalesPurchase.jsx"
import TopProducts from "../components/Home/TopProducts.jsx"
import '../styles/Statistics/statistics.css'

const Statistics = () => {
  return (
    <div className="statistics-wrapper">
      
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="rightHome-wrapper">
        <h1 id="h-h1">Home</h1>
      <hr className="custom-line-6"/>
        <div className="section1">
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
        <div className="section2">
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
