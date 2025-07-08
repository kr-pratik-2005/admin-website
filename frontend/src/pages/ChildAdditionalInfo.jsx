import React, { useState } from "react";
import giraffeIcon from "../assets/Logo.png"; // Update the path as needed
import { useNavigate,useLocation } from "react-router-dom";

export default function ChildAdditionalInfo() {
  const navigate = useNavigate();
  const location=useLocation();
  const isActive = (path) => location.pathname === path;
  const [form, setForm] = useState({
    communication: "",
    share: "",
    expectation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Additional information saved!");
    // You can navigate to a summary or dashboard if needed
  };

  return (
    <div className="child-bg">
      {/* Header */}
      <header className="child-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img src={giraffeIcon} alt="logo" className="login-logo" />
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <span
              style={{ color: '#6b7280', fontWeight: '500', cursor: 'pointer' }}
              onClick={() => navigate('/home')}
            >Home</span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={() => navigate('/daily-reports')}
            >Daily Report</span>
            <span
              style={{ color: '#8b5cf6', fontWeight: '500', cursor: 'pointer' }}
              onClick={() => navigate('/child-report')}
            >Child Data</span>
            <span
    style={{ color: '#6b7280', cursor: 'pointer' }}
    onClick={() => navigate('/reports')}
  >
    Reports
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
       
        <div className="header-right">
          <button className="add-btn">+ Add New Child</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="child-main">
        <h2 className="main-title">Child Data</h2>
        <div className="tab-bar">
      <button
        className={`tab${isActive('/child-report') ? ' tab-active' : ''}`}
        onClick={() => navigate('/child-report')}
      >
        Basic Information
      </button>
      <button
        className={`tab${isActive('/child-details') ? ' tab-active' : ''}`}
        onClick={() => navigate('/child-details')}
      >
        Emergency Details
      </button>
      <button
        className={`tab${isActive('/medical-info') ? ' tab-active' : ''}`}
        onClick={() => navigate('/medical-info')}
      >
        Medical Information
      </button>
      <button
        className={`tab${isActive('/development-info') ? ' tab-active' : ''}`}
        onClick={() => navigate('/development-info')}
      >
        Developmental Information
      </button>
      <button
        className={`tab${isActive('/daily-routine') ? ' tab-active' : ''}`}
        onClick={() => navigate('/daily-routine')}
      >
        Daily Routine
      </button>
      <button
        className={`tab${isActive('/additional-info') ? ' tab-active' : ''}`}
        onClick={() => navigate('/additional-info')}
      >
        Additional Information
      </button>
    </div>
        <form className="child-form" onSubmit={handleSave}>
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">6</span>
              Additional Information
            </div>
            <div className="form-group">
              <label>Child communication for feelings & needs</label>
              <input
                className="input"
                type="text"
                name="communication"
                placeholder="Type any keywords"
                value={form.communication}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Anything want to share with us</label>
              <input
                className="input"
                type="text"
                name="share"
                placeholder="Type any keywords"
                value={form.share}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Your expectation from mimansa kids</label>
              <input
                className="input"
                type="text"
                name="expectation"
                placeholder="Type any keywords"
                value={form.expectation}
                onChange={handleChange}
              />
            </div>
            <div className="form-btn-row">
              <button type="button" className="back-btn" onClick={() => navigate('/daily-routine')}>Back</button>
              <button type="submit" className="save-btn">Save</button>
            </div>
          </div>
        </form>
      </main>
      {/* CSS */}
      <style>{`
        .child-bg {
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
        .child-main {
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
          gap: 1rem;
          justify-content: flex-end;
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
        .save-btn {
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
        .save-btn:hover {
          background: #ffc700;
        }
        @media (max-width: 700px) {
          .child-header {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          .child-main {
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
