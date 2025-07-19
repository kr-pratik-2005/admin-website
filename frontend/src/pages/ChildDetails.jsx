import React, { useState, useContext, useEffect } from "react";

import { useNavigate, useLocation } from 'react-router-dom';
import giraffeIcon from "../assets/Logo.png";
import { ChildDataContext } from "./ChildProfileFlow";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust path as needed!

export default function ChildDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { childData, setChildData } = useContext(ChildDataContext);

  const details = childData?.details || {};
const [showEditModal, setShowEditModal] = useState(false);
const [childList, setChildList] = useState([]);
const [loadingChildren, setLoadingChildren] = useState(false);
// Helper to get all children
const fetchAllChildren = async () => {
  setLoadingChildren(true);
  setChildList([]); // reset old list on open
  const snap = await getDocs(collection(db, "child_profiles"));
  const kids = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  setChildList(kids);
  setLoadingChildren(false);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (
      name === "parentMobile" ||
      name === "motherContact" ||
      name === "fatherContact"
    ) {
      finalValue = value.replace(/\D/g, ""); // only digits
    }
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
<button
  className="add-btn"
  style={{ background: "#ffd86b", color: "#333" }}
  onClick={async (e) => {
    e.preventDefault();
    setShowEditModal(true);
    await fetchAllChildren();
  }}
>
  Edit current child data
</button>

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
              <label>Mother's Contact Number</label>
              <input
                className="input"
                type="text"
                name="motherContact"
                placeholder="1234567890"
                maxLength={10}
                value={details.motherContact || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Father's Contact Number</label>
              <input
                className="input"
                type="text"
                name="fatherContact"
                placeholder="1234567890"
                maxLength={10}
                value={details.fatherContact || ""}
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
        {showEditModal && (
  <div style={{
    position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.3)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
  }}>
    <div style={{
      background: "white",
      borderRadius: 12,
      minWidth: 320,
      maxWidth: 400,
      padding: "1.5rem",
      boxShadow: "0 4px 18px rgba(0,0,0,0.11)"
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b style={{ fontSize: "1.11rem" }}>Select a child to edit</b>
        <button style={{
            border: "none", background: "none", fontSize: 22, lineHeight: 1, cursor: "pointer", color: "#aaa"
          }} onClick={() => setShowEditModal(false)}>×</button>
      </div>
      <div style={{ marginTop: 18, maxHeight: 320, overflow: "auto" }}>
        {loadingChildren && <div style={{ padding: 10 }}>Loading...</div>}
        {!loadingChildren && childList.length === 0 && <div style={{ padding: 8, color: "#777" }}>No children found.</div>}
        {!loadingChildren && childList.map((child) => (
          <div
            key={child.id}
            style={{
              background: "#f7fafc",
              borderRadius: 6,
              padding: "13px 16px",
              marginBottom: 8,
              cursor: "pointer",
              border: "1px solid #eee",
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "background 0.17s"
            }}
            onClick={() => {
              setShowEditModal(false);
              setChildData(child); // set everything fetched (all maps under child)
            }}
          >
            <span style={{ fontSize: 15, color: "#222" }}>{child?.report?.name || "(No Name)"}</span>
            <span style={{ fontSize: 12, color: "#9473d3", marginTop: 2 }}>{child?.report?.student_id}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

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
