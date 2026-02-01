import "../../styles/Home/PurchaseOverview.css";
import purchase from "../../assets/icons/Purchase.png";
import cost from "../../assets/icons/Cost2.png";
import cancel from "../../assets/icons/Cancel.png";
import return1 from "../../assets/icons/Profit2.png";
const PurchaseOverview = () => {
  return (
    <div className="purchaseOverview">
      <h1 className="titleName">Purchase Overview</h1>
      <div className="purchase-container">
        <div className="purchase-item">
          <img className="purchase-icon" src={purchase} alt="" />
          <p className="purchasefig">82</p>
          <p className="subtitle">Purchase</p>
        </div>
        <div className="purchase-item">
          <img className="purchase-icon" src={cost} alt="" />
          <p className="purchasefig">₹ 13,573</p>
          <p className="subtitle">Cost</p>
        </div>
        <div className="purchase-item">
          <img className="purchase-icon" src={cancel} alt="" />
          <p className="purchasefig">5</p>
          <p className="subtitle">Cancel</p>
        </div>
        <div className="purchase-item">
          <img className="purchase-icon" src={return1} alt="" />
          <p className="purchasefig">₹ 17,432</p>
          <p className="subtitle">Return</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOverview;
