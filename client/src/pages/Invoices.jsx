import { useState } from "react";
import '../styles/Invoices/Invoices.css'
import Sidebar from '../components/Sidebar';
import OverallInvoice from '../components/Invoices/OverallInvoice';
import InvoiceTable from '../components/Invoices/InvoiceTable';
import searchImg from '../assets/icons/Search.png'

const Invoices = () => {
  const [search, setSearch] = useState("");  
  return (
    <div className="invoices-wrapper">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className= "rightHome-wrapper">
        <div className="titlebar">
          <h1 id="p-h1">Invoice</h1>
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
        <div className="overall-invoice">
          <OverallInvoice />
        </div>
        <div className="invoiceTable">
          < InvoiceTable
            search={search}
            // onAddProduct={() => setShowModal(true)}
          />
        </div>
      </div>
      


    </div>
  )
}

export default Invoices
