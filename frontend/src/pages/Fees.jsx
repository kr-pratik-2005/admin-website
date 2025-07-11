import React from "react";
import giraffeIcon from "../assets/Logo.png"; // Update path as needed
import { useNavigate } from "react-router-dom";

export default function Fees() {
  const navigate = useNavigate();

  return (
    <div className="fees-bg">
      {/* Header */}
      <header className="fees-header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src={giraffeIcon} alt="logo" className="fees-logo" />
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
      <main className="fees-main">
        <h2 className="fees-title">Fees & Invoice</h2>
        <div className="fees-grid">
          <div className="fees-card master" tabIndex={0}>
           <div
  className="fees-card master"
  tabIndex={0}
  onClick={() => navigate('/fees/master-table')}
>
  <span className="fees-card-label">Master Table</span>
</div>
          </div>
          <div className="fees-card table" tabIndex={0}>
           <div
  className="fees-card table"
  tabIndex={0}
  onClick={() => navigate('/fees/table')}
>
  <span className="fees-card-label">Fees Table</span>
</div>
          </div>
          <div className="fees-card invoice" tabIndex={0}>
<div
  className="fees-card invoice"
  tabIndex={0}
  onClick={() => navigate('/fees/monthly-invoice')}
>
  <span className="fees-card-label">Monthly Invoice</span>
</div>
          </div>
          <div className="fees-card report" tabIndex={0}>
          <span
        className="fees-report-btn"
        onClick={() => navigate("/fees-report")}
      >
        Fees Report
      </span>
          </div>
        </div>
      </main>

      {/* CSS */}
      <style>{`
        .fees-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .fees-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .fees-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .fees-main {
          max-width: 900px;
          margin: 3rem auto 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 48px 24px 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fees-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.5rem;
        }
        .fees-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 2.5rem;
          justify-items: center;
          align-items: center;
        }
        .fees-card {
          width: 260px;
          height: 160px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          font-size: 1.22rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.14s, box-shadow 0.14s;
          user-select: none;
        }
        .fees-card:focus, .fees-card:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 6px 18px rgba(139,115,85,0.13);
        }
        .fees-card.master {
          background: #e6e6fa;
          color: #5c4d7d;
        }
        .fees-card.table {
          background: #c6ffd9;
          color: #2e6d4c;
        }
        .fees-card.invoice {
          background: #fffec6;
          color: #a48c1f;
        }
        .fees-card.report {
          background: #ffd6d6;
          color: #a14d4d;
        }
        .fees-card-label {
          font-size: 1.22rem;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .fees-main {
            max-width: 98vw;
            padding: 24px 2vw 24px 2vw;
          }
          .fees-grid {
            gap: 1.3rem;
          }
          .fees-card {
            width: 95vw;
            max-width: 340px;
            height: 110px;
          }
        }
        @media (max-width: 600px) {
          .fees-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(4, 1fr);
            gap: 1rem;
          }
          .fees-card {
            width: 100%;
            min-width: 0;
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}
