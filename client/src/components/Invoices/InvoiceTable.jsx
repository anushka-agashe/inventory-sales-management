import { useEffect, useState, useRef } from "react";
import "../../styles/Invoices/InvoiceTable.css";
import axios from "axios";
import billPaid from "../../assets/icons/bill paid.png";
import viewInv from "../../assets/icons/hugeicons_view.png";
import delInvoice from "../../assets/icons/material-symbols_delete-outline-rounded.png";
import DeleteInvoice from "./DeleteInvoice";
import InvoicePreviewModal from "./InvoicePreviewModal";

const InvoiceTable = ({ search }) => {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const menuRef = useRef(null);
  //  const [activePaidMenu, setActivePaidMenu] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const limit = 6;

      const res = await axios.get(
        `http://localhost:4000/api/invoices?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setInvoices(res.data.invoices || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  const toggleStatus = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:4000/api/invoices/toggle/${invoiceId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      fetchInvoices(); // refresh table
      window.dispatchEvent(new Event("invoiceUpdated")); // refresh dashboard
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/invoices/${invoiceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchInvoices();
      window.dispatchEvent(new Event("invoiceUpdated"));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const viewInvoice = (invoiceId) => {
    window.open(`/invoices/${invoiceId}`, "_blank");
  };

  const confirmDeleteInvoice = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:4000/api/invoices/${invoiceToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      fetchInvoices();
      window.dispatchEvent(new Event("invoiceUpdated"));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };


  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null); // close menu
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


const filteredInvoices = invoices.filter((inv) =>
  inv.invoiceId?.toLowerCase().includes(search?.toLowerCase()) ||
  inv.referenceNumber?.toLowerCase().includes(search?.toLowerCase()) ||
  inv.status?.toLowerCase().includes(search?.toLowerCase())
);

  return (
    <>
      <div className="invoiceTable">
        <div className="title-container">
          <h3 id="tableTitle">Invoices List</h3>
        </div>

        <div className="invoicesList">
          <table className="invoices-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Reference Number</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices?.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No invoices found
                  </td>
                </tr>
              ) : (
                  filteredInvoices.map((inv) => (
                  <tr
                    key={inv._id}
                    style={{ cursor: "pointer" }}
                    // onClick={() => handleRowClick(inv)}
                  >
                    <td>{inv.invoiceId}</td>
                    <td>{inv.referenceNumber}</td>
                    <td>₹{inv.amount}</td>
                    <td>{inv.status}</td>

                    <td className="actionCell">
                      {inv.dueDate
                        ? new Date(inv.dueDate).toLocaleDateString()
                        : "—"}

                      <div
                        className="dots"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(
                            activeMenu === inv._id ? null : inv._id,
                          );
                        }}
                      >
                        ⋮
                      </div>

                      {activeMenu === inv._id && (
                        <div className="actionMenu" ref={menuRef}>
                          {inv.status === "Unpaid" && (
                            <button
                              className="statusBtn unpaid"
                              onClick={() => toggleStatus(inv.invoiceId)}
                            >
                              <img className="img-bg" src={billPaid} alt="" />
                              Unpaid
                            </button>
                          )}

                          {inv.status === "Paid" && (
                            <>
                              <button
                                className="statusBtn paid"
                                onClick={() => toggleStatus(inv.invoiceId)}
                              >
                                <img className="img-bg" src={billPaid} alt="" />
                                Paid
                              </button>
                              <div className="invoice-action">
                                <button
                                  className="menuBtn"
                                  // onClick={() => viewInvoice(inv.invoiceId)}
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setShowInvoiceModal(true);
                                    setActiveMenu(null);
                                  }}
                                >
                                  <img src={viewInv} alt="" />
                                  View Invoice
                                </button>

                                <button
                                  className="menuBtn delete"
                                  onClick={() => {
                                    setInvoiceToDelete(inv.invoiceId);
                                    setShowDeleteModal(true);
                                    setActiveMenu(null);
                                  }}
                                >
                                  <img src={delInvoice} alt="" />
                                  Delete Invoice
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
      </div>
      {showDeleteModal && (
        <DeleteInvoice
          onCancel={() => {
            setShowDeleteModal(false);
            setInvoiceToDelete(null);
          }}
          onConfirm={confirmDeleteInvoice}
        />
      )}
      {showInvoiceModal && (
  <InvoicePreviewModal
    invoice={selectedInvoice}
    onClose={() => {
      setShowInvoiceModal(false);
      setSelectedInvoice(null);
    }}
  />
)}
    </>
  );
};

export default InvoiceTable;
