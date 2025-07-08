import React from "react";
import giraffeIcon from "../assets/Logo.png"; // Update path as needed
import { useNavigate } from 'react-router-dom';
export default function Reports() {
    const navigate = useNavigate();
  return (
    <div className="reports-bg">
      {/* Header */}
      <header className="reports-header">
        
<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
  <img src={giraffeIcon} alt="logo" className="reports-logo" />
  <nav style={{ display: 'flex', gap: '2rem' }}>
    <span
      style={{ color: '#6b7280', fontWeight: '500', cursor: 'pointer' }}
      onClick={() => navigate('/home')}
    >
      Home
    </span>
    <span
      style={{ color: '#6b7280', cursor: 'pointer' }}
      onClick={() => navigate('/daily-reports')}
    >
      Daily Report
    </span>
    <span
      style={{ color: '#8b5cf6', fontWeight: '500', cursor: 'pointer' }}
    >
      Reports
    </span>
    <span
      style={{ color: '#6b7280', cursor: 'pointer' }}
      onClick={() => navigate('/child-report')}
    >
      Child Data
    </span>
    <span
  style={{ color: '#6b7280', cursor: 'pointer' }}
  onClick={() => navigate('/themes')}
>
  Theme
</span>

<span
  style={{ color: '#6b7280', cursor: 'pointer' }}
  onClick={() => navigate('/fees')}
>
  Fees
</span>

  </nav>
</div>
        <div style={{ width: 44 }}></div>
      </header>

      {/* Main Content */}
      <main className="reports-main">
        <h2 className="reports-title">Reports</h2>
        <div className="reports-cards">
          <div
  className="report-card daily"
  tabIndex={0}
  onClick={() => navigate('/daily-reports-lists')}
>
  <span className="card-label">Daily Reports</span>
</div>
          <div className="report-card attendance" tabIndex={0}>
            <span className="card-label">Attendance Report</span>
          </div>
        </div>
      </main>

      {/* CSS */}
      <style>{`
        .reports-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .reports-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .reports-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .reports-main {
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
        .reports-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.5rem;
        }
        .reports-cards {
          display: flex;
          gap: 3.5rem;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .report-card {
          width: 340px;
          height: 320px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          font-size: 1.4rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.14s, box-shadow 0.14s;
          user-select: none;
        }
        .report-card:focus, .report-card:hover {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 8px 24px rgba(139,115,85,0.15);
        }
        .report-card.daily {
          background: #eaffb0;
          color: #3d2c19;
        }
        .report-card.attendance {
          background: #ffd6c9;
          color: #7d3a2f;
        }
        .card-label {
          font-size: 1.22rem;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .reports-main {
            max-width: 1000px;
            padding: 48px 24px 48px 24px;
          }
          .reports-cards {
            flex-direction: column;
            gap: 2rem;
          }
          .report-card {
            width: 95vw;
            max-width: 400px;
            height: 1060px;
          }
        }
      `}</style>
    </div>
  );
}
