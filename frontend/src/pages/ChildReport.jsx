import React, { useContext, useState } from "react";
import giraffeIcon from "../assets/Logo.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { ChildDataContext } from "./ChildProfileFlow";

import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function ChildReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { childData, setChildData } = useContext(ChildDataContext);

  // NEW STATE for popup and fetch
  const [showPopup, setShowPopup] = useState(false);
  const [checkingStudentId, setCheckingStudentId] = useState(false);
  const [studentIdQuery, setStudentIdQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
const [childList, setChildList] = useState([]);
const [loadingChildren, setLoadingChildren] = useState(false);
const [showRemoveModal, setShowRemoveModal] = useState(false);
const [removingChildId, setRemovingChildId] = useState(null); // So we can show loading state

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
const handleRemoveChild = async (child) => {
  setRemovingChildId(child.id);

  // First, delete from child_profiles
  await deleteDoc(doc(db, "child_profiles", child.id));

  // Then, search for student in "students" collection by student_id
  if (child?.report?.student_id) {
    // Find document in "students" with same student_id
    const studentSnap = await getDocs(query(
      collection(db, "students"),
      where("student_id", "==", child.report.student_id)
    ));
    studentSnap.forEach(async (docsnap) => {
      await deleteDoc(doc(db, "students", docsnap.id));
    });
  }
  // Remove from UI
  setChildList(prev => prev.filter((c) => c.id !== child.id));
  setRemovingChildId(null);
  // Optionally close modal or show a success message
  // setShowRemoveModal(false);
};



  const isActive = (path) => location.pathname === path;

  const classOptions = ["Playgroup", "Nursery", "Pre primary I", "Pre-primary-II", "Pre-primary-III"];

  const bloodGroups = [
    "A (+ve)", "A (-ve)",
    "B (+ve)", "B (-ve)",
    "AB (+ve)", "AB (-ve)",
    "O (+ve)", "O (-ve)"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData((prev) => ({
      ...prev,
      report: {
        ...prev.report,
        [name]: value,
      }
    }));
  };

  // Firestore check method for student_id
  const handleStudentIdChange = async (e) => {
    handleChange(e);
    const value = e.target.value.trim();
    setStudentIdQuery(value);

    if (value.length > 0) {
      setCheckingStudentId(true);
      // Query for matching student_id -- your DB is "child_profiles", nested field: report.student_id
      const q = query(
        collection(db, "child_profiles"),
        where("report.student_id", "==", value)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        // Student with this ID exists, show popup (do not set any data)
        setShowPopup(true);
      }
      setCheckingStudentId(false);
    }
  };

  const reportData = childData?.report || {};

  const handleNext = () => {
    navigate("/child-profile/child-details");
  };

  // ---- MAIN RETURN ----
  return (
    <div className="child-bg">
      {/* Header */}
        <header className="child-header">
              <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                <img src={giraffeIcon} alt="logo" className="login-logo" />
                <nav style={{ display: "flex", gap: "2rem" }}>
                  <span style={{ color: '#6b7280', fontWeight: '500', cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</span>
                  <span style={{ color: '#6b7280', cursor: 'pointer' }} onClick={() => navigate('/daily-reports')}>Daily Report</span>
                  <span style={{ color: '#6b7280', cursor: 'pointer' }} onClick={() => navigate('/reports')}>Reports</span>
                  <span style={{ color: '#8b5cf6', fontWeight: '500', cursor: 'pointer' }}>Child Data</span>
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
<button
  className="add-btn"
  style={{ background: "#c32b2b", color: "#fff" }}
  onClick={async (e) => {
    e.preventDefault();
    setShowRemoveModal(true);
    await fetchAllChildren();
  }}
>
  Remove Child
</button>


              </div>
            </header>

      {/* Main Content */}
      <main className="child-main">
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

        {/* ---------- FORM STARTS HERE ---------- */}
        <form className="child-form">
          <div className="form-section">
            <div className="section-title">
              <span className="section-icon">1</span>
              Basic Information
            </div>
            {/* Name */}
            <div className="form-group">
              <label>Name</label>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Enter child's name"
                value={reportData.name || ""}
                onChange={handleChange}
              />
            </div>
            {/* Class Dropdown */}
            <div className="form-group">
              <label>Class</label>
              <select
                className="input"
                name="class"
                value={reportData.class || ""}
                onChange={handleChange}
              >
                <option value="">Select class</option>
                {classOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* Student ID */}
            <div className="form-group">
              <label>Student ID</label>
              <input
                className="input"
                type="text"
                name="student_id"
                placeholder="Enter student ID"
                value={reportData.student_id || ""}
                onChange={handleStudentIdChange}
                disabled={checkingStudentId}
                style={checkingStudentId ? { background: "#eee" } : {}}
              />
              {checkingStudentId && (
                <div style={{ fontSize: '0.9rem', color: '#999', marginTop: 2 }}>Checking…</div>
              )}
            </div>
            {/* DOB and Blood Group */}
            <div className="form-row">
              <div className="form-group">
                <label>DOB</label>
                <input
                  className="input"
                  type="date"
                  name="dob"
                  value={reportData.dob || ""}
                  min="1900-01-01"
                  max="2100-12-31"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select
                  className="input"
                  name="blood_group"
                  value={reportData.blood_group || ""}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Joining Date */}
            <div className="form-group">
              <label>Joining Date</label>
              <input
                className="input"
                type="date"
                name="joining_date"
                value={reportData.joining_date || ""}
                min="1900-01-01"
                max="2100-12-31"
                onChange={handleChange}
              />
            </div>
            {/* Nick Name */}
            <div className="form-group">
              <label>Any nick name or preferred name</label>
              <input
                className="input"
                type="text"
                name="nick_name"
                placeholder="Enter nickname"
                value={reportData.nick_name || ""}
                onChange={handleChange}
              />
            </div>
            {/* Language */}
            <div className="form-group">
              <label>Language spoken at home</label>
              <input
                className="input"
                type="text"
                name="language_spoken_at_home"
                placeholder="Enter language"
                value={reportData.language_spoken_at_home || ""}
                onChange={handleChange}
              />
            </div>
            {/* Next */}
            <div className="form-btn-row">
              <button type="button" className="next-btn" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        </form>

        {/* ---------- MODAL / POPUP ---------- */}
        {showPopup && (
          <div style={{
            position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.3)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", minWidth: 300 }}>
              <p style={{ marginBottom: "1rem", color: "#d32f2f" }}>
                <b>Student with this ID already exists.</b><br />
                Please enter a new student ID.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setChildData(prev => ({
                      ...prev,
                      report: { ...prev.report, student_id: "" }
                    }));
                  }}
                  style={{ background: "#ffd86b", color: "#fff", padding: "0.5rem 1.5rem", borderRadius: 4 }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
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
{showRemoveModal && (
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
        <b style={{ fontSize: "1.11rem" }}>Select a child to <span style={{color:"#c32b2b"}}>Remove</span></b>
        <button style={{
            border: "none", background: "none", fontSize: 22, lineHeight: 1, cursor: "pointer", color: "#aaa"
          }} onClick={() => setShowRemoveModal(false)}>×</button>
      </div>
      <div style={{ marginTop: 18, maxHeight: 320, overflow: "auto" }}>
        {loadingChildren && <div style={{ padding: 10 }}>Loading...</div>}
        {!loadingChildren && childList.length === 0 && <div style={{ padding: 8, color: "#777" }}>No children found.</div>}
        {!loadingChildren && childList.map((child) => (
          <div
            key={child.id}
            style={{
              background: "#fff0f0",
              borderRadius: 6,
              padding: "13px 16px",
              marginBottom: 8,
              cursor: removingChildId ? "not-allowed" : "pointer",
              border: "1px solid #f5c3c3",
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              opacity: removingChildId === child.id ? 0.5 : 1,
              pointerEvents: removingChildId ? "none" : "auto",
              transition: "background 0.17s"
            }}
            onClick={() => {
              if (!removingChildId) handleRemoveChild(child);
            }}
          >
            <span style={{ fontSize: 15, color: "#d32f2f" }}>{child?.report?.name || "(No Name)"}</span>
            <span style={{ fontSize: 12, color: "#9473d3", marginTop: 2 }}>{child?.report?.student_id}</span>
            {removingChildId === child.id && (
              <span style={{color:"#c32b2b", fontSize:12, marginTop:4 }}>Removing…</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}


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
        .header-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .child-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.18s;
        }
        .nav-link:hover {
          color: #3b82f6;
        }
        .nav-active {
          color: #8b5cf6;
          font-weight: 600;
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
        .tab.active {
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
        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 20px;
        }
        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }
        .dob-row {
          display: flex;
          gap: 0.7rem;
        }
        .input, select {
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
        .input:focus, select:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
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
          .header-left {
            flex-direction: column;
            gap: 1rem;
          }
          .nav-links {
            gap: 1rem;
          }
          .child-main {
            padding: 16px 2vw 16px 2vw;
          }
          .form-section {
            padding: 1.1rem 0.7rem;
          }
          .form-row {
            flex-direction: column;
            gap: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
