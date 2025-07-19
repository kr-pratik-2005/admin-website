import React, { useState, useContext } from "react";
import giraffeIcon from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  doc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { ChildDataContext } from "./ChildProfileFlow";

export default function ChildAdditionalInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { childData, setChildData } = useContext(ChildDataContext);
  const additional = childData?.additional || {};
  const [showEditModal, setShowEditModal] = useState(false);
  const [childList, setChildList] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  // Helper to get all children
  const fetchAllChildren = async () => {
    setLoadingChildren(true);
    setChildList([]);
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
    setChildData((prev) => ({
      ...prev,
      additional: {
        ...prev.additional,
        [name]: value,
      },
    }));
  };

  // ✅ Function to get number of days in the current month
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  // ============= UPDATED handleSave ===============
  const handleSave = async (e) => {
    e.preventDefault();
    const { report = {}, details = {} } = childData;

    // Grab all required fields
    const studentId      = report.student_id?.trim();
    const name           = report.name?.trim();
    const nick_name      = report.nick_name?.trim();
    const dob            = report.dob?.trim();
    const className      = report.class?.trim();
    const blood_group    = report.blood_group?.trim();
    const address        = details.blockFlat?.trim();
    const contact        = details.parentMobile?.trim();
    const father_contact = details.fatherContact?.trim();
    const mother_contact = details.motherContact?.trim();
    const father_name    = details.fatherName?.trim();
    const mother_name    = details.motherName?.trim();

    const missing = [];
    if (!studentId)      missing.push("Student ID");
    if (!name)           missing.push("Name");
    if (!nick_name)      missing.push("Nick Name");
    if (!dob)            missing.push("Date of Birth");
    if (!className)      missing.push("Class");
    if (!blood_group)    missing.push("Blood Group");
    if (!address)        missing.push("Address");
    if (!contact)        missing.push("Contact");
    if (!father_contact) missing.push("Father's Contact");
    if (!mother_contact) missing.push("Mother's Contact");
    if (!father_name)    missing.push("Father's Name");
    if (!mother_name)    missing.push("Mother's Name");

    if (missing.length) {
      alert("❌ Please fill in the following required fields before submitting:\n\n" + missing.join(", "));
      return;
    }

    // -- original logic unchanged below --
    const today = new Date().toISOString().split("T")[0];
    const totalDays = getDaysInCurrentMonth();

    try {
      // Step 1: Save child profile with student_id as doc ID
      await setDoc(doc(db, "child_profiles", studentId), {
        ...childData,
        createdAt: Timestamp.now(),
      });

      // Step 2: Check if student already exists in 'students'
      const studentsRef = collection(db, "students");
      const q = query(studentsRef, where("student_id", "==", studentId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const studentDoc = {
          student_id: studentId,
          name: report.name || "",
          nick_name: report.nick_name || "",
          dob: report.dob || "",
          grade: className,
          joined_date: report.joining_date
            ? Timestamp.fromDate(new Date(report.joining_date))
            : Timestamp.now(),
          address: details.blockFlat || "",
          contact: details.parentMobile || "",
          father_contact: details.fatherContact || "",
          mother_contact: details.motherContact || "",
          father_name: details.fatherName || "",
          mother_name: details.motherName || "",
          parent_name:  details.fatherName || "",
          blood_group: report.blood_group || "",
          date: today,
        };

        await addDoc(studentsRef, studentDoc);
        console.log("📘 New student added to 'students' collection.");
      } else {
        console.log("🔍 Student already exists in 'students'.");
      }

      // ✅ Step 3: Add to attendance_records with attendance object
      await addDoc(collection(db, "attendance_records"), {
        student_id: studentId,
        date: today,
        isPresent: false,
        class: className,
        attendance: {
          presentDays: 0,
          totalDays: totalDays,
        },
      });

      console.log("🗓️ Attendance record created with attendance object.");
      alert("✅ Child profile saved successfully!");
      navigate("/home");
    } catch (error) {
      console.error("❌ Error saving data:", error);
      alert("Error: " + error.message);
    }
  };
  // ========== END handleSave ==========

  const handleBack = () => {
    navigate("/child-profile/daily-routine");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="child-bg">
        {/* Header */}
        <header className="child-header">
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <img src={giraffeIcon} alt="logo" className="login-logo" />
            <nav style={{ display: "flex", gap: "2rem" }}>
              <span onClick={() => navigate("/home")} style={{ color: "#6b7280", fontWeight: "500", cursor: "pointer" }}>Home</span>
              <span onClick={() => navigate("/daily-reports")} style={{ color: "#6b7280", cursor: "pointer" }}>Daily Report</span>
              <span style={{ color: "#8b5cf6", fontWeight: "500" }}>Child Data</span>
              <span onClick={() => navigate("/reports")} style={{ color: "#6b7280", cursor: "pointer" }}>Reports</span>
              <span onClick={() => navigate("/themes")} style={{ color: "#6b7280", cursor: "pointer" }}>Theme</span>
              <span onClick={() => navigate("/fees")} style={{ color: "#6b7280", cursor: "pointer" }}>Fees</span>
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
                  value={additional.communication || ""}
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
                  value={additional.share || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Your expectation from Mimansa Kids</label>
                <input
                  className="input"
                  type="text"
                  name="expectation"
                  placeholder="Type any keywords"
                  value={additional.expectation || ""}
                  onChange={handleChange}
                />
              </div>
              {/* Navigation Buttons */}
              <div className="form-btn-row">
                <button type="button" className="back-btn" onClick={handleBack}>Back</button>
                <button type="submit" className="save-btn">Save</button>
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
  

 


      {/* CSS Styles */}
      <style>{`
        /* --- styles are unchanged from your original --- */
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
    </>
  );
}
