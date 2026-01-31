import "../../styles/Invoices/OverallInvoice.css";
import { useEffect, useState } from "react";
import axios from "axios";

const OverallInvoice = () => {
  const [summary, setSummary] = useState({
    recentTransactions: 0,
    totalInvoices: 0,
    totalPaidInvoices: 0,
    totalPaidAmount: 0,
    totalCustomers: 0,
    totalUnpaidAmount: 0,
    totalUnpaidInvoices: 0,
  });

  useEffect(() => {
    fetchInvoiceStats();
  }, []);

  const fetchInvoiceStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:4000/api/invoices/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching invoice dashboard", err);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:4000/api/invoices/dashboard",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    // refresh on invoice update
    const refresh = () => fetchDashboardStats();
    window.addEventListener("invoiceUpdated", refresh);

    return () => window.removeEventListener("invoiceUpdated", refresh);
  }, []);

  return (
    <div className="invoiceDashboard">
      <div className="section">
        <div className="recentTransactions">
          <h3 className="p-h3">Recent Transactions</h3>
          <p className="p-p1">{summary.recentTransactions}</p>
          <p className="p-p2">Last 7 days</p>
        </div>

        <div className="vertical-line"></div>

        <div className="totalInvoices">
          <h3 className="p-h3">Total Invoices</h3>
          <div className="totalInvoiceCount">
            <div className="invoiceCount">
              <p className="p-p1">{summary.totalInvoices}</p>
              <p className="p-p2">Total Till Date</p>
            </div>
            <div className="processedInvoice">
              <p className="p-p1">{summary.totalPaidInvoices}</p>
              <p className="p-p2">Processed</p>
            </div>
          </div>
        </div>

        <div className="vertical-line"></div>

        <div className="paidInvoiceDetails">
          <h3 className="p-h3">Paid Amount</h3>
          <div className="paidInvoice">
            <div className="paidAmt">
              <p className="p-p1">₹{summary.totalPaidAmount}</p>
              <p className="p-p2">Last 7 days</p>
            </div>
            <div className="paidCount">
              <p className="p-p1">{summary.totalCustomers}</p>
              <p className="p-p2">customers</p>
            </div>
          </div>
        </div>

        <div className="vertical-line"></div>

        <div className="unpaidInvoiceDetails">
          <h3 className="p-h3">Unpaid Amount</h3>
          <div className="unpaidInvoice">
            <div className="unpaidAmt">
              <p className="p-p1">₹{summary.totalUnpaidAmount}</p>
              <p className="p-p2">Total Pending</p>
            </div>
            <div className="unpaidCount">
              <p className="p-p1">{summary.totalUnpaidInvoices}</p>
              <p className="p-p2">Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallInvoice;
