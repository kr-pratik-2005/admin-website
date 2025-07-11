import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';

const navItems = [
  { label: "Home", path: "/" },
  { label: "Daily Report", path: "/daily-reports" },
  { label: "Reports", path: "/reports" },
  { label: "Child Data", path: "/child-report" },
  { label: "Theme", path: "/themes" },
  { label: "Fees", path: "/fees" }
];

const getStatusColor = (status, type) => {
  if (type === 'sent') {
    return status === 'Sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  } else {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Not Paid':
        return 'bg-red-100 text-red-800';
      case 'OverDue':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
};

const InvoiceStatusDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch students
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const students = studentsSnapshot.docs.map(doc => ({
        student_id: doc.id,
        ...doc.data()
      }));

      // Fetch all fees
      const feesSnapshot = await getDocs(collection(db, "fees"));
      const feesData = feesSnapshot.docs.map(doc => ({
        ...doc.data(),
        created_at: doc.data().created_at?.seconds
          ? new Date(doc.data().created_at.seconds * 1000)
          : null
      }));

      // For each student, find their latest fee record by student_id
      const formattedRows = students.map(student => {
   

        // Find all fee records for this student
        const studentFees = feesData.filter(fee => fee.student_id === student.student_id);
        // Get the latest (by created_at)
        let latestFee = null;
        if (studentFees.length > 0) {
          latestFee = studentFees.reduce((a, b) =>
            (!a.created_at || (b.created_at && b.created_at > a.created_at)) ? b : a
          );
        }

        // Determine sent and paid status
        let sentStatus = "Not Sent";
        let paidStatus = "Not Paid";
        if (latestFee) {
          sentStatus = latestFee.sent ? "Sent" : "Not Sent";
          if (latestFee.paid) {
            paidStatus = "Paid";
          } else if (latestFee.overdue) {
            paidStatus = "OverDue";
          } else {
            paidStatus = "Not Paid";
          }
        }
 console.log(student.student_id, latestFee && latestFee.sent, latestFee);
        return {
          student_id: student.student_id,
          avatar: student.avatar || "🧒",
          name: student.name || "",
          class: student.grade || "",
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
          sentStatus,
          paidStatus
        };
       

      });

      // Sort: Playgroup → Nursery → Pre primary I (or Pre-primary-1)
      const gradeOrder = { 
        "Playgroup": 1, 
        "Nursery": 2, 
        "Pre primary I": 3, 
        "Pre-primary-1": 3 
      };
      formattedRows.sort(
        (a, b) => (gradeOrder[a.class] || 99) - (gradeOrder[b.class] || 99)
      );

      setRows(formattedRows);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredData = rows.filter(item =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.class || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: '#fff'
        }}>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  color: item.label === 'Fees' && location.pathname === item.path
                    ? '#2563eb'
                    : '#6b7280',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: item.label === 'Fees' && location.pathname === item.path
                    ? '700'
                    : '500',
                  padding: '0.5rem 0',
                  borderBottom: item.label === 'Fees' && location.pathname === item.path
                    ? '2px solid #2563eb'
                    : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <input
          type="text"
          placeholder="Search by name or class"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            width: '100%',
            maxWidth: '400px'
          }}
        />

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#374151',
              margin: '0',
              textAlign: 'center'
            }}>
              Invoice Status
            </h2>
          </div>

          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
            gap: '1rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #f3f4f6',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280'
          }}>
            <div>Full Name</div>
            <div>Class</div>
            <div>Sent Status</div>
            <div>Paid Status</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          <div style={{ padding: '0 1.5rem' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                Loading...
              </div>
            ) : filteredData.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                No records found.
              </div>
            ) : (
              filteredData.map((item, index) => (
                <div
                  key={item.student_id || index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    gap: '1rem',
                    padding: '1rem 0',
                    alignItems: 'center',
                    borderBottom: index < filteredData.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {item.avatar}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {item.class}
                  </div>
                  <div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }} className={getStatusColor(item.sentStatus, 'sent')}>
                      {item.sentStatus}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }} className={getStatusColor(item.paidStatus, 'paid')}>
                      {item.paidStatus}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{
                      padding: '6px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      fontSize: '12px',
                      color: '#6b7280',
                      cursor: 'pointer'
                    }}>
                      Resend
                    </button>
                    <button style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: '#fbbf24',
                      fontSize: '12px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}>
                      View Invoice
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Back Button */}
          <div style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }} onClick={() => window.history.back()}>
              Back
            </button>
          </div>
        </div>
      </main>

      <style>{`
        .bg-green-100 { background-color: #dcfce7; }
        .text-green-800 { color: #166534; }
        .bg-red-100 { background-color: #fee2e2; }
        .text-red-800 { color: #991b1b; }
        .bg-blue-100 { background-color: #dbeafe; }
        .text-blue-800 { color: #1e40af; }
        .bg-gray-100 { background-color: #f3f4f6; }
        .text-gray-800 { color: #1f2937; }
        button:hover { opacity: 0.9; }
        input:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1); }
        a:hover { color: #8b5cf6; }
      `}</style>
    </div>
  );
};

export default InvoiceStatusDashboard;
