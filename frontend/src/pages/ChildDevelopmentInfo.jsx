import React, { useState, useContext, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import giraffeIcon from "../assets/Logo.png";
import { ChildDataContext } from "./ChildProfileFlow";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust path as needed!

export default function ChildDevelopmentInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { childData, setChildData } = useContext(ChildDataContext);

  const development = childData?.development || {};
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
    const { name, value, type, checked } = e.target;
    setChildData((prev) => ({
      ...prev,
      development: {
        ...prev.development,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleRadio = (name, value) => {
    setChildData((prev) => ({
      ...prev,
      development: {
        ...prev.development,
        [name]: value,
      },
    }));
  };

  const isActive = (path) => location.pathname === path;

  const handleNext = () => {
    navigate("/child-profile/daily-routine");
  };

  const handleBack = () => {
    navigate("/child-profile/medical-info");
  };

  return (
     <>
    <div className="child-bg">
      {/* Header */}
      <header className="child-header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src={giraffeIcon} alt="logo" className="login-logo" />
          <nav style={{ display: "flex", gap: "2rem" }}>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate("/home")}>Home</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate("/daily-reports")}>Daily Report</span>
            <span style={{ color: "#8b5cf6", fontWeight: "500", cursor: "pointer" }}>Child Data</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate("/reports")}>Reports</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate("/themes")}>Theme</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate("/fees")}>Fees</span>
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
      <main className="child-main">
        <h2 className="main-title">Child Data</h2>

        {/* Tab Bar */}
        <div className="tab-bar">
          <button className={`tab${isActive("/child-profile/child-report") ? " tab-active" : ""}`} onClick={() => navigate("/child-profile/child-report")}>Basic Information</button>
          <button className={`tab${isActive("/child-profile/child-details") ? " tab-active" : ""}`} onClick={() => navigate("/child-profile/child-details")}>Emergency Details</button>
          <button className={`tab${isActive("/child-profile/medical-info") ? " tab-active" : ""}`} onClick={() => navigate("/child-profile/medical-info")}>Medical Information</button>
          <button className={`tab${isActive("/child-profile/development-info") ? " tab-active" : ""}`} onClick={() => navigate("/child-profile/development-info")}>Developmental Information</button>
          <button className={`tab${isActive("/child-profile/daily-routine") ? " tab-active" : ""}`} onClick={() => navigate("/child-profile/daily-routine")}>Daily Routine</button>
          <button className={`tab${isActive("/child-profile/additional-info") ? " tab-active" : ""}`} onClick={() => navigate("/child-profile/additional-info")}>Additional Information</button>
        </div>

        {/* Form */}
        <form className="child-form">
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">4</span>
              Developmental Information
            </div>

            <div className="form-group">
              <label>Developmental Information</label>
              <textarea
                className="input"
                name="developmentalInfo"
                placeholder="Type any keywords"
                value={development.developmentalInfo || ""}
                onChange={handleChange}
                rows={2}
              />
            </div>

            {[ 
              { key: "pottyTrained", label: "Child potty trained" },
              { key: "sleepTrained", label: "Child sleep trained" },
              { key: "eatIndependently", label: "Child able to eat independently" },
              { key: "attendedDaycare", label: "Child attended daycare before" }
            ].map((item) => (
              <div className="form-group radio-row" key={item.key}>
                <label>{item.label}</label>
                <div className="radio-btns">
                  <button
                    type="button"
                    className={development[item.key] === true ? "radio-btn selected" : "radio-btn"}
                    onClick={() => handleRadio(item.key, true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={development[item.key] === false ? "radio-btn selected" : "radio-btn"}
                    onClick={() => handleRadio(item.key, false)}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}

            <div className="form-group">
              <label>Previous daycare details</label>
              <input
                className="input"
                type="text"
                name="previousDaycare"
                placeholder="Type any keywords"
                value={development.previousDaycare || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Child have any specific like or dislike</label>
              <input
                className="input"
                type="text"
                name="likesDislikes"
                placeholder="Type any keywords"
                value={development.likesDislikes || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Activities that the child enjoys doing</label>
              <input
                className="input"
                type="text"
                name="activities"
                placeholder="Type any keywords"
                value={development.activities || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Any triggers that lead to meltdowns + calming strategy</label>
              <input
                className="input"
                type="text"
                name="triggers"
                placeholder="Type any keywords"
                value={development.triggers || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Child behaviour that affects other Children</label>
              <input
                className="input"
                type="text"
                name="behaviour"
                placeholder="Type any keywords"
                value={development.behaviour || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Information regarding learning style or behavior</label>
              <input
                className="input"
                type="text"
                name="extraInfo"
                placeholder="Type any keywords"
                value={development.extraInfo || ""}
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
      </div>


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
        .input, textarea {
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
          resize: none;
        }
        .input:focus, textarea:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .radio-row {
          display: flex;
          flex-direction: column;
        }
        .radio-btns {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }
        .radio-btn {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #555;
          border-radius: 7px;
          padding: 7px 24px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .radio-btn.selected {
          background: #ffd86b;
          color: #fff;
          border-color: #ffd86b;
        }
        .form-btn-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 18px;
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
          .child-main {
            padding: 16px 2vw 16px 2vw;
          }
          .form-section {
            padding: 1.1rem 0.7rem;
          }
        }
      `}</style>
    
    </>
  );
}
