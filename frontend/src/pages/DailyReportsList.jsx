import React from "react";
import giraffeIcon from "../assets/Logo.png"; // Update path as needed
import { useNavigate } from 'react-router-dom';

export default function DailyReportsList() {
    const navigate = useNavigate();

  return (
    <div className="daily-bg">
      {/* Header */}
      <header className="daily-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img src={giraffeIcon} alt="logo" className="daily-logo" />
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <span
              style={{ color: '#6b7280', fontWeight: '500', cursor: 'pointer' }}
              onClick={() => window.location.href = '/home'}
            >Home</span>
            <span
            // #8b5cf6
              style={{ color: '#6b7280',  cursor: 'pointer' }}
              onClick={() => window.location.href = '/daily-reports'}
            >Daily Report</span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={() => window.location.href = '/child-report'}
            >Child Data</span>
            <span
              style={{ color: '#8b5cf6',fontWeight: '500', cursor: 'pointer' }}
              onClick={() => window.location.href = '/reports'}
            >Reports</span>
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
      <main className="daily-main">
        <h2 className="daily-title">Daily Reports</h2>
        <div className="daily-report-list">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div className="daily-report-row" key={i}>
                <div className="child-avatar" />
                <div className="child-info">
                  <div className="child-name">Mimansa</div>
                </div>
                <div className="report-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="view-btn">View Report</button>
                </div>
              </div>
            ))}
        </div>
        <div className="back-btn-row">
          <button className="back-btn" onClick={() => window.location.href = '/reports'}>Back to Reports</button>
        </div>
      </main>
      {/* CSS */}
      <style>{`
        .daily-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .daily-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .daily-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .daily-main {
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
        .daily-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.5rem;
        }
        .daily-report-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.3rem;
        }
        .daily-report-row {
          display: flex;
          align-items: center;
          background: #ffe9e1;
          border-radius: 18px;
          padding: 1.6rem 2.2rem;
          gap: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .child-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #fbbf24;
          margin-right: 1rem;
        }
        .child-info {
          flex: 1;
        }
        .child-name {
          font-size: 1.18rem;
          font-weight: 500;
          color: #374151;
        }
        .report-actions {
          display: flex;
          gap: 1.2rem;
        }
        .edit-btn {
          background: #fff;
          color: #8b5cf6;
          border: 1.5px solid #e0e6ed;
          border-radius: 9px;
          padding: 0.6rem 1.5rem;
          font-size: 1.08rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
        }
        .edit-btn:hover {
          background: #f3f4f6;
        }
        .view-btn {
          background: #ffd86b;
          color: #fff;
          border: none;
          border-radius: 9px;
          padding: 0.6rem 1.5rem;
          font-size: 1.08rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.14s;
        }
        .view-btn:hover {
          background: #ffc700;
        }
        .back-btn-row {
          margin-top: 2.5rem;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .back-btn {
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
        .back-btn:hover {
          background: #444;
        }
        @media (max-width: 900px) {
          .daily-main {
            max-width: 98vw;
            padding: 24px 2vw 24px 2vw;
          }
        }
        @media (max-width: 600px) {
          .daily-report-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
            padding: 1rem 1rem;
          }
          .back-btn-row {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
