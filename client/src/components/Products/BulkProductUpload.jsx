import "../../styles/Products/BulkProductUpload.css";
import fileIcon from "../../assets/icons/upload.png";
import preview from "../../assets/icons/flowbite_file-csv-solid.png";
import { useState } from "react";
import axios from "axios";

const BulkProductUpload = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith(".csv")) {
      setFile(selected);
      setError("");
    } else {
      setError("Only CSV files allowed");
    }
  };

  const handleNext = () => {
    if (!file) return setError("Please select a CSV file");
    setPreviewMode(true);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewMode(false);
  };

  const handleUpload = async () => {
    // if (!file) return setError("Please select a CSV file");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        "http://localhost:4000/api/products/bulkupload",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Products uploaded successfully!");
      onClose();
      window.location.reload(); // refresh table
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Upload failed");
    }
  };

  const formatSize = (size) => {
    return (size / 1024).toFixed(2) + " KB";
  };

  return (
    <div className={`bulkUploadModal ${previewMode ? "expanded" : ""}`}>
      <h3 id="b-title">CSV Upload</h3>
      <p className="txt">Add your documents here</p>
      <div className="file-container">
        <img className="file-icon" src={fileIcon} alt="" />
        <p className="instructionTxt">Drag your file(s) to start uploading</p>
        <div className="orTextSection">
          <hr className="line" />
          <p className="ortxt">OR</p>
          <hr className="line" />
        </div>

        <label className="browse">
          Browse files
          <input type="file" accept=".csv" hidden onChange={handleFileChange} />
        </label>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {previewMode && file && (
        <div className="file-preview">
          <img src={preview} alt="file" className="preview-icon" />
          <div className="file-info">
            <p className="file-name">{file.name}</p>
            <p className="file-size">{formatSize(file.size)}</p>
          </div>
          <button className="remove-file" onClick={handleRemoveFile}>
            ✕
          </button>
        </div>
      )}

      <div className="modal-actions">
        <button className="action-cancel-btn" onClick={onClose}>
          Cancel
        </button>

        {!previewMode ? (
          <button className="next-btn" onClick={handleNext}>
            Next &gt;
          </button>
        ) : (
          <button className="next-btn" onClick={handleUpload}>
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default BulkProductUpload;
