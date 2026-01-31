import "../../styles/Invoices/InvoicePreviewModal.css";

import "../../styles/Invoices/InvoicePreviewModal.css";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

import closeSym from "../../assets/icons/symbols_close.png";
import downloadSym from "../../assets/icons/symbols_download.png";
import printSym from "../../assets/icons/symbols_print.png";
import remIcon from '../../assets/icons/rem-icon.png'

const InvoicePreviewModal = ({ invoice, onClose }) => {
  const invoiceRef = useRef();

  if (!invoice) return null;

  const handleDownload = () => {
    html2pdf()
      .from(invoiceRef.current)
      .save(`Invoice-${invoice.invoiceId}.pdf`);
  };

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const win = window.open("", "", "width=700,height=900");
    win.document.write(`
      <html>
        <head><title>Invoice</title></head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="invoiceOverlay">
      <div className="invoiceWrapper">
        {/* Action Icons */}
        <div className="invoiceActions">
          <button onClick={onClose}>
            <img id="clsSym" src={closeSym} />
          </button>
          <button onClick={handleDownload}>
            <img id="dloadSym" src={downloadSym} />
          </button>
          <button onClick={handlePrint}>
            <img id="prtSym" src={printSym} />
          </button>
        </div>
        <div className="invoiceModal">
          {/* Invoice Content */}
          <div className="invoicePaper" ref={invoiceRef}>
            

            <div className="invoiceTop">
              <h1>INVOICE</h1>
              <p>
                <strong>Billed to:</strong>
              </p>
              <div className="bill-wrapper">
                <div className="billTo">
                  <p>Company Name</p>
                  <p>Company Address</p>
                  <p>City , Country - 00000</p>
                </div>

                <div className="billAdd">
                  <p>Business address</p>
                  <p>City, State, IN - 000 000</p>
                  <p>TAX ID 00XXXXX1234X0XX</p>
                </div>
              </div>
              <div className="invoice-container">
                <div className="invoice-sidebar">
                  <div className="sidebar-item">
                <p>
                  <strong>Invoice #</strong>
                </p>
                <p>
                  {invoice.invoiceId}
                </p>
                </div>
                <div className="sidebar-item">
                <p>
                  <strong>Invoice Date</strong>{" "}
                </p>
                <p>
                  {/* {new Date(invoice.date).toLocaleDateString()} */}
                  {new Date(new Date(invoice.dueDate).getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                </div>
                <div className="sidebar-item">
                <p>
                  <strong>Reference</strong>
                </p>
                <p>
                  {invoice.referenceNumber}
                </p>
                </div>
                <div className="sidebar-item">
                <p>
                  <strong>Due Date</strong>{" "}
                </p>
                <p>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                  </div>
              </div>
              <table className="invoiceTablePreview">
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{invoice.product?.name}</td>
                  <td>{invoice.quantity}</td>
                  <td>₹{invoice.price}</td>
                  <td>₹{invoice.amount}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="invoice-total-row">
                <td><h3>Total</h3></td>
                <td></td>
                <td></td>
                <td><h3>₹{invoice.amount}</h3></td>
                </tr>
              </tfoot>
            </table>
            
            </div>
            <p className="reminder">
              <img src={remIcon} alt="" />
                Please pay within 7 days of receiving this invoice.
            </p>

            

              </div>
            {/* <div className="invoiceSummary">
            
              <h3>Total: ₹{invoice.amount}</h3>
              
            </div> */}
            
<div className="inv-footer">
  <p className="invoiceFooter">
              www.recehtol.inc
            </p>
            <p className="invoiceFooter">
              +91 00000 00000
            </p>
            <p className="invoiceFooter">
              hello@email.com
            </p>
</div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreviewModal;
