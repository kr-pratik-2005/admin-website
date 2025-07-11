import React, { useEffect, useState } from "react";
import giraffeIcon from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export function getMonthString(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[month - 1]} ${year}`;
}

export default function MonthlyInvoice() {
  const navigate = useNavigate();
  const [month, setMonth] = useState("2025-06");
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const students = studentsSnapshot.docs.map(doc => doc.data());

      const monthStr = getMonthString(month);
      const invoicesSnapshot = await getDocs(
        query(collection(db, "fees"), where("month", "==", monthStr))
      );
      const invoices = invoicesSnapshot.docs.map(doc => doc.data());

      const [year, monthNum] = month.split("-").map(Number);
      const totalDays = new Date(year, monthNum, 0).getDate();
      const firstDay = `${year}-${String(monthNum).padStart(2, "0")}-01`;
      const lastDay = `${year}-${String(monthNum).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;
      const attendanceSnapshot = await getDocs(collection(db, "attendance_records"));
      const attendanceRecords = attendanceSnapshot.docs.map(doc => doc.data());

      const rowsData = students.map((student, idx) => {
        const invoice = invoices.find(inv => inv.student_id === student.student_id);

        const attendanceForStudent = attendanceRecords.filter(
          a =>
            a.student_id === student.student_id &&
            a.date >= firstDay &&
            a.date <= lastDay
        );
        const totalPresent = attendanceForStudent.filter(a => a.isPresent).length;

        return {
          id: idx + 1,
          student_id: student.student_id,
          name: student.name,
          class: student.grade,
          invoice: invoice ? invoice.invoice_number : "",
          fees: invoice ? `₹ ${invoice.fee || invoice.amount}` : (student.fees ? `₹ ${student.fees}` : "N/A"),
          attendance: `${totalPresent}/${totalDays}`,
          sent: invoice ? !!invoice.sent : false,
          paid: invoice ? !!invoice.paid : false,
          overdue: invoice ? !!invoice.overdue : false,
        };
      });

      const gradeOrder = { "Playgroup": 1, "Nursery": 2, "Pre primary I": 3 };
      rowsData.sort((a, b) => (gradeOrder[a.class] || 99) - (gradeOrder[b.class] || 99));

      setRows(rowsData);
    };

    fetchData();
  }, [month]);

  // Filter rows based on search term (name or class)
  const filteredRows = rows.filter(row =>
    (row.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.class || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="invoice-bg">
      <header className="invoice-header">
        {/* ...header code... */}
      </header>
      <main className="invoice-main">
        <h2 className="invoice-title">Monthly Invoice</h2>
        <div className="invoice-month-row">
          <label>Select Month</label>
          <input
            type="month"
            className="invoice-month-input"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
        </div>
        {/* Search Box */}
        <div style={{ width: "100%", maxWidth: 500, marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search by name or class"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              borderRadius: "7px",
              border: "1px solid #e5e7eb",
              background: "#f7f9fa",
              fontSize: "1rem",
              marginBottom: 0
            }}
          />
        </div>
        <div className="invoice-table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Class</th>
                <th>Invoice Number</th>
                <th>Fees</th>
                <th>Attendance</th>
                <th>Sent Status</th>
                <th>Paid Status</th>
                <th>Send Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={
                    idx % 3 === 0
                      ? "row-pink"
                      : idx % 3 === 1
                      ? "row-yellow"
                      : "row-orange"
                  }
                >
                  <td>
                    <div className="invoice-avatar-name">
                      <div className="invoice-avatar">
                        <span role="img" aria-label="avatar">🧒</span>
                      </div>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td>{row.class}</td>
                  <td>{row.invoice || "N/A"}</td>
                  <td>
                    <input className="invoice-input" value={row.fees} readOnly />
                  </td>
                  <td>{row.attendance}</td>
                  <td>
                    {row.sent ? (
                      <span className="status-sent">Sent</span>
                    ) : (
                      <span className="status-not-sent">Not Sent</span>
                    )}
                  </td>
                  <td>
                    {row.paid ? (
                      <span className="status-paid">Paid</span>
                    ) : row.overdue ? (
                      <span className="status-overdue">OverDue</span>
                    ) : (
                      <span className="status-not-paid">Not Paid</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="invoice-edit-btn"
                      onClick={() =>
                        navigate('/fees/edit-invoice', {
                          state: {
                            student_id: row.student_id,
                            name: row.name,
                            grade: row.class,
                            fee: row.fees,
                            month: getMonthString(month)
                          }
                        })
                      }
                      disabled={row.sent}
                    >
                      Send Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="invoice-btn-row">
          <button className="invoice-back-btn" onClick={() => navigate('/fees')}>Back</button>
        </div>
      </main>
  






 


      {/* CSS */}
      <style>{`
        .invoice-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .invoice-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .invoice-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .invoice-main {
          max-width: 1200px;
          margin: 3rem auto 0 auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 48px 32px 32px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .invoice-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.5rem;
        }
        .invoice-month-row {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 2.2rem;
          width: 100%;
          max-width: 500px;
        }
        .invoice-month-row label {
          font-weight: 500;
          color: #444;
        }
        .invoice-month-input {
          background: #f7f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          padding: 8px 12px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .invoice-month-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .invoice-table-container {
          width: 100%;
          overflow-x: auto;
        }
        .invoice-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
          font-size: 1.04rem;
          background: transparent;
        }
        .invoice-table th {
          background: #f9fafb;
          color: #6b7280;
          font-weight: 600;
          padding: 1rem 0.8rem;
          text-align: left;
          border-radius: 8px 8px 0 0;
        }
        .invoice-table td {
          background: transparent;
          padding: 1rem 0.8rem;
          color: #374151;
          font-weight: 500;
          border-top: none;
          border-bottom: none;
        }
        .invoice-avatar-name {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .invoice-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .invoice-input {
          width: 90px;
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
        .invoice-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .status-sent {
          background: #eaffb0;
          color: #5c7a2d;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-not-sent {
          background: #ffe1e1;
          color: #a14d4d;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-paid {
          background: #c6ffd9;
          color: #2e6d4c;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-not-paid {
          background: #ffe1e1;
          color: #a14d4d;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .status-overdue {
          background: #e1eaff;
          color: #4d5fa1;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.97rem;
          font-weight: 600;
        }
        .invoice-edit-btn {
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
        .invoice-edit-btn:hover {
          background: #f3f4f6;
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
        .invoice-btn-row {
          margin-top: 2.2rem;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          gap: 1.2rem;
        }
        .invoice-back-btn {
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
        .invoice-back-btn:hover {
          background: #444;
        }
        .invoice-send-btn {
          background: #ffd86b;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.9rem 2.2rem;
          font-size: 1.08rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255,216,107,0.09);
          transition: background 0.18s;
        }
        .invoice-send-btn:hover {
          background: #ffc700;
        }
        @media (max-width: 1200px) {
          .invoice-main {
            max-width: 99vw;
            padding: 24px 2vw 24px 2vw;
          }
        }
        @media (max-width: 700px) {
          .invoice-table th, .invoice-table td {
            padding: 0.7rem 0.4rem;
            font-size: 0.97rem;
          }
          .invoice-avatar {
            width: 32px;
            height: 32px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
