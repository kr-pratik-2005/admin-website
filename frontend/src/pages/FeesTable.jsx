import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import giraffeIcon from "../assets/Logo.png";

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = `${year}-${String(month + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
  return { firstDay, lastDay, totalDays };
}

export default function FeesTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const students = studentsSnapshot.docs.map(doc => doc.data());

      const feesSnapshot = await getDocs(collection(db, "fees"));
      const fees = feesSnapshot.docs.map(doc => doc.data());

      const attendanceSnapshot = await getDocs(collection(db, "attendance_records"));
      const attendanceRecords = attendanceSnapshot.docs.map(doc => doc.data());

      const { firstDay, lastDay, totalDays } = getCurrentMonthRange();

      const rowsData = fees.map(fee => {
        const student = students.find(s => s.student_id === fee.student_id);

        const attendanceForStudent = attendanceRecords.filter(
          a =>
            a.student_id === fee.student_id &&
            a.date >= firstDay &&
            a.date <= lastDay
        );
        const totalPresent = attendanceForStudent.filter(a => a.isPresent).length;

        return {
          student_id: fee.student_id,
          name: student?.name || "N/A",
          grade: student?.grade || "N/A",
          attendance: `${totalPresent}/${totalDays}`,
          fees: fee.fee || "N/A",
          frequency: fee.frequency || "Monthly",
          dateOfJoin: student?.joined_date
            ? new Date(
                student.joined_date.seconds
                  ? student.joined_date.seconds * 1000
                  : student.joined_date
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
              })
            : "N/A"
        };
      });

      const gradeOrder = { "Playgroup": 1, "Nursery": 2, "Pre primary I": 3 };
      rowsData.sort(
        (a, b) => (gradeOrder[a.grade] || 99) - (gradeOrder[b.grade] || 99)
      );

      setRows(rowsData);
    };

    fetchData();
  }, []);

  return (
    <div className="fees-table-bg">
      <main className="fees-table-main">
        <h2 className="fees-table-title">Fees Table</h2>
        <div className="fees-table-container">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Class</th>
                <th>Attendance</th>
                <th>Fees</th>
                <th>Frequency</th>
                <th>Date of Join</th>
                <th>View / Edit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student, idx) => (
                <tr
                  key={idx}
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
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td>{student.grade}</td>
                  <td>{student.attendance}</td>
                  <td>
                    <input className="fees-input" value={student.fees} readOnly />
                  </td>
                  <td>
                    <select className="fees-input" value={student.frequency} readOnly>
                      <option>Monthly</option>
                    </select>
                  </td>
                  <td>
                    <input className="fees-input" value={student.dateOfJoin} readOnly />
                  </td>
                  <td>
                    <div className="fees-action-btns">
                      <button className="fees-edit-btn">Edit</button>
                      
                      <button
  className="fees-view-btn"
  onClick={() => {
    console.log("Navigating with student_id:", student.student_id); // ✅ Add this line
    navigate('/fees/report-table', {
      state: {
        student_id: student.student_id,
      }
    });
  }}
>
  View Report
</button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="fees-back-row">
          <button className="fees-back-btn" onClick={() => navigate('/fees')}>
            Back
          </button>
        </div>
      </main>
 


 

      {/* CSS */}
      <style>{`
        .fees-table-bg {
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
        .fees-table-main {
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
        .fees-table-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.2rem;
        }
        .fees-table-container {
          width: 100%;
          overflow-x: auto;
        }
        .fees-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
          font-size: 1.04rem;
          background: transparent;
        }
        .fees-table th {
          background: #f9fafb;
          color: #6b7280;
          font-weight: 600;
          padding: 1rem 0.8rem;
          text-align: left;
          border-radius: 8px 8px 0 0;
        }
        .fees-table td {
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
        .fees-input {
          width: 110px;
          padding: 6px 10px;
          border-radius: 7px;
          border: 1px solid #e5e7eb;
          background: #f7f9fa;
          font-size: 1rem;
          margin: 0;
          box-sizing: border-box;
          outline: none;
          transition: border 0.2s;
        }
        .fees-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
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
          background: #fffbe1;
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
          .fees-table-main {
            max-width: 99vw;
            padding: 24px 2vw 24px 2vw;
          }
        }
        @media (max-width: 700px) {
          .fees-table th, .fees-table td {
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
