import "../../styles/Invoices/DeleteInvoice.css";

const DeleteInvoice = ({ onCancel, onConfirm }) => {
  return (
    <div className="deleteInvoiceCard">
      <p className="inv-txt">This invoice will be deleted.</p>
      <div className="delete-actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button className="confirm-btn" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeleteInvoice;
