import React, { useState } from "react";
import giraffeIcon from "../assets/Logo.png"; // Update path as needed
import { useNavigate } from "react-router-dom";

export default function EditInvoice() {
  const navigate = useNavigate();
  const [feesAmount, setFeesAmount] = useState("9500");
  const [remarks, setRemarks] = useState("");

  return (
    <div className="edit-invoice-bg">
      {/* Header */}
      <header className="edit-invoice-header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src={giraffeIcon} alt="logo" className="edit-invoice-logo" />
          <nav style={{ display: "flex", gap: "2rem" }}>
            <span style={{ color: "#6b7280", fontWeight: "500", cursor: "pointer" }} onClick={() => navigate('/home')}>Home</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/daily-reports')}>Daily Report</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/reports')}>Reports</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/child-report')}>Child Data</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/themes')}>Theme</span>
            <span style={{ color: "#8b5cf6", fontWeight: "500", cursor: "pointer" }}>Fees</span>
          </nav>
        </div>
        <div style={{ width: 44 }}></div>
      </header>

      {/* Main Content */}
      <main className="edit-invoice-main">
        <h2 className="edit-invoice-title">Invoice Details</h2>
        <div className="edit-invoice-card">
          <div className="edit-invoice-row">
            <label className="edit-invoice-label">Name</label>
            <input className="edit-invoice-input" value="Mimansa" readOnly />
          </div>
          <div className="edit-invoice-row">
            <label className="edit-invoice-label">Class</label>
            <input className="edit-invoice-input" value="Nursery" readOnly />
          </div>
          <div className="edit-invoice-row">
            <label className="edit-invoice-label">Invoice Number</label>
            <input className="edit-invoice-input" value="#123456" readOnly />
          </div>
          <div className="edit-invoice-row">
            <label className="edit-invoice-label">Fees Amount</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.1rem", color: "#888" }}>₹</span>
              <input
                className="edit-invoice-input"
                type="number"
                value={feesAmount}
                onChange={e => setFeesAmount(e.target.value)}
                style={{ maxWidth: 120 }}
              />
            </div>
          </div>
          <div className="edit-invoice-row" style={{ alignItems: "center" }}>
            <input type="checkbox" style={{ marginRight: 8 }} id="no-invoice" />
            <label htmlFor="no-invoice" style={{ color: "#888", fontWeight: 500, cursor: "pointer" }}>
              No Invoice for this Month
            </label>
          </div>
          <div className="edit-invoice-row">
            <label className="edit-invoice-label">Remarks</label>
            <textarea
              className="edit-invoice-textarea"
              placeholder="Type any keywords"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              rows={3}
            />
          </div>
          <div className="edit-invoice-row">
            <label className="edit-invoice-label">Razorpay Link</label>
            <input className="edit-invoice-input" value="Generated automatically" readOnly />
          </div>
          <div className="edit-invoice-btn-row">
            <button
              type="button"
              className="edit-invoice-back-btn"
              onClick={() => navigate('/fees/monthly-invoice')}
            >
              Back
            </button>
            <button type="button" className="edit-invoice-save-btn">
              Save Invoice
            </button>
          </div>
        </div>
      </main>
      {/* CSS */}
      <style>{`
        .edit-invoice-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .edit-invoice-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .edit-invoice-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .edit-invoice-main {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }
        .edit-invoice-title {
          font-size: 1.45rem;
          font-weight: 600;
          color: #374151;
          margin: 3rem 0 2rem 0;
        }
        .edit-invoice-card {
          width: 420px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 38px 32px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .edit-invoice-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.25rem;
        }
        .edit-invoice-label {
          width: 140px;
          color: #444;
          font-weight: 500;
          font-size: 1.07rem;
        }
        .edit-invoice-input {
          flex: 1;
          background: #f7f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .edit-invoice-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .edit-invoice-textarea {
          flex: 1;
          background: #f7f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 1rem;
          outline: none;
          min-height: 60px;
          resize: vertical;
          transition: border 0.2s;
        }
        .edit-invoice-textarea:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .edit-invoice-btn-row {
          display: flex;
          justify-content: flex-end;
          gap: 1.2rem;
          margin-top: 1.7rem;
        }
        .edit-invoice-back-btn {
          background: #f3f4f6;
          color: #888;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 32px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        .edit-invoice-save-btn {
          background: #ffd86b;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 32px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255,216,107,0.09);
          transition: background 0.18s;
        }
        .edit-invoice-save-btn:hover {
          background: #ffc700;
        }
        @media (max-width: 600px) {
          .edit-invoice-card {
            width: 98vw;
            padding: 18px 2vw 18px 2vw;
          }
          .edit-invoice-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .edit-invoice-label {
            width: 100%;
            margin-bottom: 2px;
          }
        }
      `}</style>
    </div>
  );
}
