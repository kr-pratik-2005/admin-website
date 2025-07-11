// ViewReport.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import giraffeIcon from "../assets/Logo.png";

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export default function ViewReport() {
  const { studentId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const today = getTodayDateString();

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const reportId = `${studentId}_${today}`;
      const reportRef = doc(db, "daily_reports", reportId);
      const reportSnap = await getDoc(reportRef);
      if (reportSnap.exists()) {
        setReport(reportSnap.data());
      } else {
        setReport(null);
      }
      setLoading(false);
    };
    fetchReport();
  }, [studentId, today]);

  if (loading) {
    return <div className="view-report-loading">Loading...</div>;
  }

  if (!report) {
    return (
      <div className="view-report-bg">
        <div className="view-report-header">
          <img src={giraffeIcon} alt="logo" className="view-report-logo" />
          <h2>Daily Report</h2>
        </div>
        <div className="view-report-main">
          <div className="no-report-rectangle">
            <img src={giraffeIcon} alt="Mimansa Logo" className="no-report-logo" />
            <div className="no-report-text">No report found</div>
          </div>
          <button className="view-report-back-btn" onClick={() => navigate('/daily-reports')}>Back</button>
        </div>
        <style>{`
          .no-report-rectangle {
            margin: 2.5rem auto 0 auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.08);
            padding: 60px 32px 60px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 320px;
            min-height: 220px;
            max-width: 400px;
            position: relative;
          }
          .no-report-logo {
            width: 70px;
            height: 70px;
            object-fit: contain;
            margin-bottom: 24px;
            display: block;
          }
          .no-report-text {
            font-size: 1.25rem;
            color: #888;
            font-weight: 600;
            text-align: center;
            letter-spacing: 0.03em;
          }
   
 

        .view-report-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .view-report-header {
          background: #fff;
          padding: 1.5rem 2rem 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .view-report-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .view-report-header h2 {
          font-size: 1.45rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }
        .view-report-main {
          max-width: 650px;
          margin: 2.5rem auto 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 36px 32px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .view-report-card {
          width: 100%;
        }
        .view-report-row {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          margin-bottom: 1.1rem;
          gap: 1.5rem;
        }
        .view-report-label {
          min-width: 130px;
          color: #888;
          font-weight: 500;
          font-size: 1.01rem;
        }
        .view-report-value {
          color: #374151;
          font-weight: 600;
          font-size: 1.08rem;
          min-width: 120px;
        }
        .view-report-back-btn {
          margin-top: 2.2rem;
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
        .view-report-back-btn:hover {
          background: #ffc700;
        }
        .view-report-loading,
        .view-report-empty {
          font-size: 1.18rem;
          color: #888;
          text-align: center;
          margin: 3rem 0;
        }
        @media (max-width: 700px) {
          .view-report-main {
            padding: 16px 5vw 16px 5vw;
            max-width: 99vw;
          }
          .view-report-label, .view-report-value {
            min-width: 80px;
            font-size: 0.97rem;
          }
        }
      `}</style>
    </div>
  );
}
}