import React, { useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import giraffeIcon from "../assets/Logo.png";
import { ChildDataContext } from "./ChildProfileFlow";

export default function ChildDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { childData, setChildData } = useContext(ChildDataContext);

  const details = childData?.details || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "parentMobile" ? value.replace(/\D/g, "") : value;

    setChildData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: finalValue
      }
    }));
  };

  const isActive = (path) => location.pathname === path;

  const handleNext = () => {
    navigate("/child-profile/medical-info");
  };

  const handleBack = () => {
    navigate("/child-profile/child-report");
  };

  return (
    <div className="child-details-bg">
      {/* Header */}
      <header className="child-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img src={giraffeIcon} alt="logo" className="login-logo" />
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ color: '#6b7280', fontWeight: '500', cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</span>
            <span style={{ color: '#6b7280', cursor: 'pointer' }} onClick={() => navigate('/daily-reports')}>Daily Report</span>
            <span style={{ color: '#8b5cf6', fontWeight: '500', cursor: 'pointer' }}>Child Data</span>
            <span style={{ color: '#6b7280', cursor: 'pointer' }} onClick={() => navigate('/reports')}>Reports</span>
            <span style={{ color: '#6b7280', cursor: 'pointer' }} onClick={() => navigate('/themes')}>Theme</span>
            <span style={{ color: '#6b7280', cursor: 'pointer' }} onClick={() => navigate('/fees')}>Fees</span>
          </nav>
        </div>
        <div className="header-right">
          <button className="add-btn">+ Add New Child</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="child-details-main">
        <h2 className="main-title">Child Data</h2>

        {/* Tab Bar */}
        <div className="tab-bar">
          <button className={`tab${isActive("/child-profile/child-report") ? ' tab-active' : ''}`} onClick={() => navigate("/child-profile/child-report")}>Basic Information</button>
          <button className={`tab${isActive("/child-profile/child-details") ? ' tab-active' : ''}`} onClick={() => navigate("/child-profile/child-details")}>Emergency Details</button>
          <button className={`tab${isActive("/child-profile/medical-info") ? ' tab-active' : ''}`} onClick={() => navigate("/child-profile/medical-info")}>Medical Information</button>
          <button className={`tab${isActive("/child-profile/development-info") ? ' tab-active' : ''}`} onClick={() => navigate("/child-profile/development-info")}>Developmental Information</button>
          <button className={`tab${isActive("/child-profile/daily-routine") ? ' tab-active' : ''}`} onClick={() => navigate("/child-profile/daily-routine")}>Daily Routine</button>
          <button className={`tab${isActive("/child-profile/additional-info") ? ' tab-active' : ''}`} onClick={() => navigate("/child-profile/additional-info")}>Additional Information</button>
        </div>

        {/* Form */}
        <form className="child-form">
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">2</span>
              Emergency Details
            </div>

            <div className="form-group">
              <label>Mobile number of parents with relationship</label>
              <input
                className="input"
                type="text"
                name="parentMobile"
                placeholder="1234567890"
                maxLength={10}
                value={details.parentMobile || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Block & Flat No</label>
              <input
                className="input"
                type="text"
                name="blockFlat"
                placeholder="1,xxx colony"
                value={details.blockFlat || ""}
                onChange={handleChange}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="form-btn-row">
              <button type="button" className="back-btn" onClick={handleBack}>Back</button>
              <button type="button" className="next-btn" onClick={handleNext}>Next</button>
            </div>
          </div>
        </form>
      </main>
 


      <style>{`
        .child-details-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .child-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .login-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .header-right .add-btn {
          background: #fff;
          color: #8b5cf6;
          border: 1px solid #e0e6ed;
          border-radius: 8px;
          padding: 0.5rem 1.2rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .header-right .add-btn:hover {
          background: #f3f4f6;
        }
        .child-details-main {
          max-width: 540px;
          margin: 2.5rem auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 36px 24px 24px 24px;
        }
        .main-title {
          font-size: 1.45rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 18px;
          text-align: center;
        }
        .tab-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 30px;
          overflow-x: auto;
        }
        .tab {
          background: #f3f4f6;
          border: none;
          color: #6b7280;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 8px 8px 0 0;
          padding: 0.7rem 1.3rem;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          outline: none;
        }
        .tab-active, .tab.tab-active {
          background: #ffd86b;
          color: #fff;
        }
        .form-section {
          background: #f7fafc;
          border-radius: 12px;
          padding: 2rem 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .section-title {
          font-weight: 600;
          color: #444;
          font-size: 1.15rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .section-icon {
          background: #ffd86b;
          color: #fff;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.15rem;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 7px;
          border: 1px solid #e5e7eb;
          background: #f7f9fa;
          font-size: 1rem;
          margin-top: 4px;
          margin-bottom: 2px;
          box-sizing: border-box;
          outline: none;
          transition: border 0.2s;
        }
        .input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .form-btn-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 18px;
        }
        .back-btn {
          background: #f3f4f6;
          color: #888;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 32px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        .next-btn {
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
        .next-btn:hover {
          background: #ffc700;
        }
        @media (max-width: 700px) {
          .child-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          .child-details-main {
            padding: 16px 2vw 16px 2vw;
          }
          .form-section {
            padding: 1.1rem 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
