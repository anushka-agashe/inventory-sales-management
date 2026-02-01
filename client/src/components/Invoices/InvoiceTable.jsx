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
  const [activeRow, setActiveRow] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuRef = useRef(null);

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      const limit = isMobile ? 1000 : 6;

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/invoices?page=${page}&limit=${limit}`,
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
        `${process.env.REACT_APP_API_URL}/api/invoices/toggle/${invoiceId}`,
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/invoices/${invoiceId}`, {
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
        `${process.env.REACT_APP_API_URL}/api/invoices/${invoiceToDelete}`,
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
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceId?.toLowerCase().includes(search?.toLowerCase()) ||
      inv.referenceNumber?.toLowerCase().includes(search?.toLowerCase()) ||
      inv.status?.toLowerCase().includes(search?.toLowerCase()),
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
                {!isMobile && (
                  <>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </>
                )}

                {isMobile && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((inv) => {
                const isPaid = inv.status === "Paid";
                const isActive = activeRow === inv._id;

                return (
                  <tr key={inv._id}>
                    <td className="invoiceCell">
                      <div className="cell-content">
                        {inv.invoiceId}
                        {isMobile && (
                          <span
                            className="dots"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRow(isActive ? null : inv._id);
                            }}
                          >
                            ⋮
                          </span>
                        )}
                      </div>

                      {isMobile && isActive && (
                        <button
                          className={`floatingStatusBtn ${isPaid ? "paid" : "unpaid"}`}
                          onClick={() => toggleStatus(inv.invoiceId)}
                        >
                          {isPaid ? "Paid" : "Unpaid"}
                        </button>
                      )}
                    </td>

                    {!isMobile && (
                      <>
                        <td>{inv.referenceNumber}</td>
                        <td>₹{inv.amount}</td>
                        <td>{inv.status}</td>
                        <td className="dueDateCell">
                          {inv.dueDate
                            ? new Date(inv.dueDate).toLocaleDateString()
                            : "—"}
                          <span
                            className="dots"
                            onClick={() =>
                              setActiveRow(isActive ? null : inv._id)
                            }
                          >
                            ⋮
                          </span>
                          {isActive && (
                            <div className="desktopMenuWrapper" ref={menuRef}>
                              <button
                                className={`floatingStatusBtn ${isPaid ? "paid" : "unpaid"}`}
                                onClick={() => toggleStatus(inv.invoiceId)}
                              >
                                {isPaid ? "Paid" : "Unpaid"}
                              </button>
                              {isPaid && (
                                <div className="desktopActionsBox">
                                  <button
                                    onClick={() => {
                                      setSelectedInvoice(inv);
                                      setShowInvoiceModal(true);
                                      setActiveRow(null);
                                    }}
                                  >
                                    <img src={viewInv} alt="view" /> View
                                  </button>
                                  <button
                                    onClick={() => {
                                      setInvoiceToDelete(inv.invoiceId);
                                      setShowDeleteModal(true);
                                      setActiveRow(null);
                                    }}
                                  >
                                    <img src={delInvoice} alt="delete" /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </>
                    )}

                    {isMobile && (
                      <td className="mobileActionIcons">
                        <div className="mobile-btn-wrapper">
                          <button
                            disabled={!isPaid}
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowInvoiceModal(true);
                            }}
                          >
                            <img src={viewInv} alt="view" />
                          </button>
                          <button
                            disabled={!isPaid}
                            onClick={() => {
                              setInvoiceToDelete(inv.invoiceId);
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={delInvoice} alt="delete" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isMobile && (
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
        )}
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
