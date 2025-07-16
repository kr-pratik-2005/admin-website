import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import giraffeIcon from "../assets/Logo.png";
import { ChildDataContext } from "./ChildProfileFlow";

export default function ChildDevelopmentInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { childData, setChildData } = useContext(ChildDataContext);

  const development = childData?.development || {};

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
          <button className="add-btn">+ Add New Child</button>
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
