import React, { useEffect, useState } from "react";
import giraffeIcon from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function FeesReportView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student_id } = location.state || {};

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!student_id) {
        setData(null);
        setLoading(false);
        return;
      }

      // 1. Fetch student info
      const studentQ = query(
        collection(db, "students"),
        where("student_id", "==", student_id)
      );
      const studentSnap = await getDocs(studentQ);
      if (studentSnap.empty) {
        setData(null);
        setLoading(false);
        return;
      }
      const student = studentSnap.docs[0].data();

      // 2. Fetch latest fees record for this student
      const feesQ = query(
        collection(db, "fees"),
        where("student_id", "==", student_id)
      );
      const feesSnap = await getDocs(feesQ);
      let latestFee = null;
      if (!feesSnap.empty) {
        latestFee = feesSnap.docs
          .map(doc => doc.data())
          .sort((a, b) => (b.created_at?.seconds || 0) - (a.created_at?.seconds || 0))[0];
      }

      // 3. Fetch attendance
      const attendanceQ = query(
        collection(db, "attendance_records"),
        where("student_id", "==", student_id)
      );
      const attendanceSnap = await getDocs(attendanceQ);
      const attendanceTotal = attendanceSnap.docs.length;
      const attendancePresent = attendanceSnap.docs.filter(doc => doc.data().isPresent).length;

      // 4. Set data
      setData({
        name: student.name,
        class: student.grade,
        attendance: `${attendancePresent}/${attendanceTotal}`,
        frequency: latestFee ? (latestFee.frequency || "Monthly") : "Monthly",
        dateOfJoin: student.joined_date
          ? new Date(
              student.joined_date.seconds
                ? student.joined_date.seconds * 1000
                : student.joined_date
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
            })
          : "",
        fees: latestFee
  ? `₹ ${latestFee.fees !== undefined ? latestFee.fees : "N/A"}`
  : (student.fees !== undefined ? `₹ ${student.fees}` : "N/A"),

      });
      setLoading(false);
    };

    fetchStudentData();
  }, [student_id]);

  if (loading) return <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading...</div>;
  if (!data) return <div style={{ textAlign: "center", marginTop: "3rem" }}>Student not found.</div>;

  return (
    <div className="fees-report-bg">
      {/* Header */}
      <header className="fees-header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src={giraffeIcon} alt="logo" className="fees-logo" />
          <nav style={{ display: "flex", gap: "2rem" }}>
            <span style={{ color: "#6b7280", fontWeight: "500", cursor: "pointer" }} onClick={() => navigate('/home')}>Home</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/daily-reports')}>Daily Report</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/reports')}>Reports</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() =>navigate("/child-profile/child-report")}>Child Data</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/themes')}>Theme</span>
            <span style={{ color: "#8b5cf6", fontWeight: "500", cursor: "pointer" }}>Fees</span>
          </nav>
        </div>
        <div style={{ width: 44 }}></div>
      </header>

      {/* Main Content */}
      <main className="fees-report-main">
        <div className="fees-report-card">
          <h2 className="fees-report-title">View Report</h2>
          <form className="fees-report-form">
            <div className="fees-report-row">
              <label className="fees-report-label">Name</label>
              <input className="fees-report-input" value={data.name} readOnly />
            </div>
            <div className="fees-report-row">
              <label className="fees-report-label">Class</label>
              <input className="fees-report-input" value={data.class} readOnly />
            </div>
            <div className="fees-report-row">
              <label className="fees-report-label">Attendance</label>
              <input className="fees-report-input" value={data.attendance} readOnly />
            </div>
            <div className="fees-report-row">
              <label className="fees-report-label">Frequency</label>
              <input className="fees-report-input" value={data.frequency} readOnly />
            </div>
            <div className="fees-report-row">
              <label className="fees-report-label">Date of Join</label>
              <input className="fees-report-input" value={data.dateOfJoin} readOnly />
            </div>
            <div className="fees-report-row">
              <label className="fees-report-label">Fees</label>
              <input className="fees-report-input" value={data.fees} readOnly />
            </div>
            <div className="fees-report-btn-row">
              <button type="button" className="fees-back-btn" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </form>
        </div>
      </main>

  

  

      {/* CSS */}
      <style>{`
        .fees-report-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .fees-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .fees-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .fees-report-main {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fees-report-card {
          width: 410px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 38px 32px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .fees-report-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.2rem;
          text-align: center;
        }
        .fees-report-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .fees-report-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .fees-report-label {
          width: 130px;
          color: #444;
          font-weight: 500;
          font-size: 1.07rem;
        }
        .fees-report-input {
          flex: 1;
          background: #f7f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .fees-report-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .fees-report-btn-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.7rem;
        }
        .fees-back-btn {
          background: #888;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 32px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.14s;
        }
        .fees-back-btn:hover {
          background: #444;
        }
        @media (max-width: 600px) {
          .fees-report-card {
            width: 98vw;
            padding: 18px 2vw 18px 2vw;
          }
          .fees-report-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .fees-report-label {
            width: 100%;
            margin-bottom: 2px;
          }
        }
      `}</style>
    </div>
  );
}
