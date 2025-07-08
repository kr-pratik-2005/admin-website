import React, { useState } from "react";
import giraffeIcon from "../assets/Logo.png"; // Update path as needed
import { useNavigate } from "react-router-dom";

const sampleInvoices = [
  {
    id: 1,
    name: "Mimansa",
    avatar: "", // You can add avatar image path here
    class: "Playgroup",
    invoice: "#123456",
    fees: "₹ 5000",
    attendance: "20/30",
    sent: true,
    paid: true,
    overdue: false
  },
  {
    id: 2,
    name: "Mimansa",
    avatar: "",
    class: "Nursery",
    invoice: "#123456",
    fees: "₹ 5000",
    attendance: "30/30",
    sent: true,
    paid: true,
    overdue: false
  },
  {
    id: 3,
    name: "Mimansa",
    avatar: "",
    class: "Playgroup",
    invoice: "#123456",
    fees: "₹ 5000",
    attendance: "10/30",
    sent: false,
    paid: false,
    overdue: false
  },
  {
    id: 4,
    name: "Mimansa",
    avatar: "",
    class: "Playgroup",
    invoice: "#123456",
    fees: "₹ 5000",
    attendance: "20/30",
    sent: true,
    paid: false,
    overdue: true
  },
  {
    id: 5,
    name: "Mimansa",
    avatar: "",
    class: "Nursery",
    invoice: "#123456",
    fees: "₹ 5000",
    attendance: "30/30",
    sent: true,
    paid: false,
    overdue: true
  },
  {
    id: 6,
    name: "Mimansa",
    avatar: "",
    class: "Playgroup",
    invoice: "#123456",
    fees: "₹ 5000",
    attendance: "10/30",
    sent: true,
    paid: false,
    overdue: false
  }
];

export default function MonthlyInvoice() {
  const navigate = useNavigate();
  const [month, setMonth] = useState("2025-06");

  return (
    <div className="invoice-bg">
      {/* Header */}
      <header className="invoice-header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src={giraffeIcon} alt="logo" className="invoice-logo" />
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
      <main className="invoice-main">
        <h2 className="invoice-title">Monthly Invoice</h2>
        <div className="invoice-month-row">
          <label>Select Month</label>
          <input
            type="month"
            className="invoice-month-input"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
        </div>
        <div className="invoice-table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Class</th>
                <th>Invoice Number</th>
                <th>Fees</th>
                <th>Attendance</th>
                <th>Sent Status</th>
                <th>Paid Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {sampleInvoices.map((row, idx) => (
                <tr
                  key={row.id}
                  className={
                    idx % 3 === 0
                      ? "row-pink"
                      : idx % 3 === 1
                      ? "row-yellow"
                      : "row-orange"
                  }
                >
                  <td>
                    <div className="invoice-avatar-name">
                      <div className="invoice-avatar">
                        <span role="img" aria-label="avatar">🧒</span>
                      </div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td>{row.class}</td>
                  <td>{row.invoice}</td>
                  <td>
                    <input className="invoice-input" value={row.fees} readOnly />
                  </td>
                  <td>{row.attendance}</td>
                  <td>
                    {row.sent ? (
                      <span className="status-sent">Sent</span>
                    ) : (
                      <span className="status-not-sent">Not Sent</span>
                    )}
                  </td>
                  <td>
                    {row.paid ? (
                      <span className="status-paid">Paid</span>
                    ) : row.overdue ? (
                      <span className="status-overdue">OverDue</span>
                    ) : (
                      <span className="status-not-paid">Not Paid</span>
                    )}
                  </td>
                  <td>
                    <button className="invoice-edit-btn">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="invoice-btn-row">
          <button className="invoice-back-btn" onClick={() => navigate('/fees')}>Back</button>
<button
  className="invoice-send-btn"
  onClick={() => navigate('/fees/edit-invoice')}
>
  Send Invoice
</button>
        </div>
      </main>
      {/* CSS */}
      <style>{`
        .invoice-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .invoice-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .invoice-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .invoice-main {
          max-width: 1200px;
          margin: 3rem auto 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 48px 32px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .invoice-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.5rem;
        }
        .invoice-month-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 2.2rem;
          width: 100%;
          max-width: 500px;
        }
        .invoice-month-row label {
          font-weight: 500;
          color: #444;
        }
        .invoice-month-input {
          background: #f7f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          padding: 8px 12px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .invoice-month-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .invoice-table-container {
          width: 100%;
          overflow-x: auto;
        }
        .invoice-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
          font-size: 1.04rem;
          background: transparent;
        }
        .invoice-table th {
          background: #f9fafb;
          color: #6b7280;
          font-weight: 600;
          padding: 1rem 0.8rem;
          text-align: left;
          border-radius: 8px 8px 0 0;
        }
        .invoice-table td {
          background: transparent;
          padding: 1rem 0.8rem;
          color: #374151;
          font-weight: 500;
          border-top: none;
          border-bottom: none;
        }
        .invoice-avatar-name {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .invoice-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .invoice-input {
          width: 90px;
          padding: 6px 10px;
          border-radius: 7px;
          border: 1px solid #e5e7eb;
          background: #f7f9fa;
          font-size: 1rem;
          margin: 0;
          box-sizing: border-box;
          outline: none;
          transition: border 0.2s;
        }
        .invoice-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .status-sent {
          background: #eaffb0;
          color: #5c7a2d;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-not-sent {
          background: #ffe1e1;
          color: #a14d4d;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-paid {
          background: #c6ffd9;
          color: #2e6d4c;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-not-paid {
          background: #ffe1e1;
          color: #a14d4d;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-overdue {
          background: #e1eaff;
          color: #4d5fa1;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .invoice-edit-btn {
          background: #fff;
          color: #8b5cf6;
          border: 1.5px solid #e0e6ed;
          border-radius: 7px;
          padding: 0.48rem 1.2rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
        }
        .invoice-edit-btn:hover {
          background: #f3f4f6;
        }
        .row-pink td {
          background: #ffe9e1;
        }
        .row-yellow td {
          background: #fff7e1;
        }
        .row-orange td {
          background: #fffbe1;
        }
        .invoice-btn-row {
          margin-top: 2.2rem;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          gap: 1.2rem;
        }
        .invoice-back-btn {
          background: #888;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.9rem 2.2rem;
          font-size: 1.08rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.14s;
        }
        .invoice-back-btn:hover {
          background: #444;
        }
        .invoice-send-btn {
          background: #ffd86b;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.9rem 2.2rem;
          font-size: 1.08rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255,216,107,0.09);
          transition: background 0.18s;
        }
        .invoice-send-btn:hover {
          background: #ffc700;
        }
        @media (max-width: 1200px) {
          .invoice-main {
            max-width: 99vw;
            padding: 24px 2vw 24px 2vw;
          }
        }
        @media (max-width: 700px) {
          .invoice-table th, .invoice-table td {
            padding: 0.7rem 0.4rem;
            font-size: 0.97rem;
          }
          .invoice-avatar {
            width: 32px;
            height: 32px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
