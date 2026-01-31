import Sidebar from "../components/Sidebar.jsx";
import SalesOverview from "../components/Home/SalesOverview.jsx";
import InventorySummary from "../components/Home/InventorySummary.jsx";
import "../styles/Home/Home.css";
import PurchaseOverview from "../components/Home/PurchaseOverview.jsx";
import ProductSummary from "../components/Home/ProductSummary.jsx";
import SalesPurchase from "../components/Home/SalesPurchase.jsx";
import TopProducts from "../components/Home/TopProducts.jsx";

const Home = () => {
  return (
    <div className="home-wrapper">
      
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="rightHome-wrapper">
        <h1 id="h-h1">Home</h1>
      <hr className="custom-line-6"/>
        <div className="section1">
          <div className="salesOverview">
            <SalesOverview />
          </div>
          <div className="inventorySummary">
            <InventorySummary />
          </div>
        </div>
        <div className="section2">
          <div className="purchaseOverview">
            <PurchaseOverview />
          </div>
          <div className="inventorySummary">
            <ProductSummary />
          </div>
        </div>
        <div className="section3">
          <div className="salesPurchase">
            < SalesPurchase/>
          </div>
          <div className="topProducts">
            <TopProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
