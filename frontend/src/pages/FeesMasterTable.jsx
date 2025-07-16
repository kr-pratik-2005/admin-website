import React, { useEffect, useState } from "react";
import giraffeIcon from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function FeesMasterTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch students
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const students = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Fetch fees (assuming only one doc with the fee value)
      const feesSnapshot = await getDocs(collection(db, "fees"));
      let feeAmount = "";
      if (!feesSnapshot.empty) {
        // Use the first fee document found
        const feeDoc = feesSnapshot.docs[0].data();
        feeAmount = feeDoc.fee ? `₹ ${feeDoc.fee}` : "";
      }

      // Build rows (include student_id!)
      const formattedRows = students.map(student => ({
        student_id: student.student_id, // <-- include this
        avatar: student.avatar || "",
        name: student.name || "",
        class: student.grade || "",
        fees: feeAmount,
        frequency: "Monthly",
        dateOfJoin: student.joined_date
          ? new Date(student.joined_date.seconds
              ? student.joined_date.seconds * 1000
              : student.joined_date
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric"
            })
          : "",
      }));

      const gradeOrder = { "Playgroup": 1, "Nursery": 2, "Pre primary I": 3 };
      formattedRows.sort((a, b) => (gradeOrder[a.class] || 99) - (gradeOrder[b.class] || 99));
      setRows(formattedRows);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="fees-master-bg">
      {/* Header */}
      <header className="fees-header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src={giraffeIcon} alt="logo" className="fees-logo" />
          <nav style={{ display: "flex", gap: "2rem" }}>
            <span style={{ color: "#6b7280", fontWeight: "500", cursor: "pointer" }} onClick={() => navigate('/home')}>Home</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/daily-reports')}>Daily Report</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/reports')}>Reports</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate("/child-profile/child-report")}>Child Data</span>
            <span style={{ color: "#6b7280", cursor: "pointer" }} onClick={() => navigate('/themes')}>Theme</span>
            <span style={{ color: "#8b5cf6", fontWeight: "500", cursor: "pointer" }}>Fees</span>
          </nav>
        </div>
        <div style={{ width: 44 }}></div>
      </header>

      {/* Main Content */}
      <main className="fees-master-main">
        <h2 className="fees-master-title">Master table</h2>
        <div className="fees-master-table-container">
          <table className="fees-master-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Class</th>
                <th>Fees</th>
                <th>Frequency</th>
                <th>Date of Join</th>
                <th>View / Edit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading...</td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr
                    key={row.student_id || idx}
                    className={
                      idx % 3 === 0
                        ? "row-pink"
                        : idx % 3 === 1
                        ? "row-yellow"
                        : "row-orange"
                    }
                  >
                    <td>
                      <div className="fees-avatar-name">
                        <div className="fees-avatar">
                          <span role="img" aria-label="avatar">🧒</span>
                        </div>
                        <span>{row.name}</span>
                      </div>
                    </td>
                    <td>{row.class}</td>
                    <td>{row.fees}</td>
                    <td>{row.frequency}</td>
                    <td>{row.dateOfJoin}</td>
                    <td>
                      <div className="fees-action-btns">
                        <button className="fees-edit-btn">Edit</button>
                        <button
                          className="fees-view-btn"
                          onClick={() => navigate(`/view-report/${row.student_id}`)}
                          disabled={!row.student_id}
                        >
                          View Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="fees-back-row">
          <button className="fees-back-btn" onClick={() => navigate('/fees')}>Back</button>
        </div>
      </main>
 

      
 

      {/* CSS */}
      <style>{`
        .fees-master-bg {
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
        .fees-master-main {
          max-width: 1080px;
          margin: 3rem auto 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 48px 24px 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fees-master-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.2rem;
        }
        .fees-master-table-container {
          width: 100%;
          overflow-x: auto;
        }
        .fees-master-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
          font-size: 1.04rem;
          background: transparent;
        }
        .fees-master-table th {
          background: #f9fafb;
          color: #6b7280;
          font-weight: 600;
          padding: 1rem 0.8rem;
          text-align: left;
          border-radius: 8px 8px 0 0;
        }
        .fees-master-table td {
          background: transparent;
          padding: 1rem 0.8rem;
          color: #374151;
          font-weight: 500;
          border-top: none;
          border-bottom: none;
        }
        .fees-avatar-name {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .fees-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .fees-action-btns {
          display: flex;
          gap: 0.6rem;
        }
        .fees-edit-btn {
          background: #fff;
          color: #8b5cf6;
          border: 1.5px solid #e0e6ed;
          border-radius: 7px;
          padding: 0.48rem 1.2rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.14s, color 0.14s;
        }
        .fees-edit-btn:hover {
          background: #f3f4f6;
        }
        .fees-view-btn {
          background: #ffd86b;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 0.48rem 1.2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.14s;
        }
        .fees-view-btn:hover {
          background: #ffc700;
        }
        .row-pink td {
          background: #ffe9e1;
        }
        .row-yellow td {
          background: #fff7e1;
        }
        .row-orange td {
          background: #fff3e1;
        }
        .fees-back-row {
          margin-top: 2.2rem;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .fees-back-btn {
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
        .fees-back-btn:hover {
          background: #444;
        }
        @media (max-width: 1100px) {
          .fees-master-main {
            max-width: 99vw;
            padding: 24px 2vw 24px 2vw;
          }
        }
        @media (max-width: 700px) {
          .fees-master-table th, .fees-master-table td {
            padding: 0.7rem 0.4rem;
            font-size: 0.97rem;
          }
          .fees-avatar {
            width: 32px;
            height: 32px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
