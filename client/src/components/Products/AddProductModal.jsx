import '../../styles/Products/AddProductModal.css'

const AddProductModal = ({ onClose ,onIndividualClick ,onBulkClick }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
    <div className="addProduct" onClick={(e) => e.stopPropagation()}>
      <button className="add-btn" onClick={onIndividualClick}>Individual product </button>
      <button className="add-btn" onClick={onBulkClick}>Multiple product </button>
    </div>
    </div>
  );
};

export default AddProductModal;
