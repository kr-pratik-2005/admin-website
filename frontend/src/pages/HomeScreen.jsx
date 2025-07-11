import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Camera } from 'lucide-react';
import giraffeIcon from "../assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { 
  collection, getDocs, query, where, doc, updateDoc 
} from 'firebase/firestore';

const HomeScreen = () => {
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const navigate = useNavigate();

  // Get today's date string in YYYY-MM-DD
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Get current month range
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month, totalDays).toISOString().split('T')[0];

  // Fetch students for today on mount
 useEffect(() => {
  const fetchAndMarkAbsent = async () => {
    // 1. Fetch all students
    const studentsSnapshot = await getDocs(collection(db, "students"));
    const allStudents = studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 2. For each student, ensure attendance record for today exists (mark absent if not)
    for (const student of allStudents) {
      const attendanceQ = query(
        collection(db, "attendance_records"),
        where("student_id", "==", student.student_id),
        where("date", "==", todayStr)
      );
      const attendanceSnapshot = await getDocs(attendanceQ);

      if (attendanceSnapshot.empty) {
        // No attendance record for today: mark as absent
        await collection(db, "attendance_records").add({
          student_id: student.student_id,
          date: todayStr,
          isPresent: false
        });
        // Update isPresent in students collection for UI consistency
        await updateDoc(doc(db, "students", student.id), { isPresent: false });
      }
    }

    // 3. Fetch students for today (with today's date in their "date" field)
    const q = query(
      collection(db, "students"),
      where("date", "==", todayStr)
    );
    const querySnapshot = await getDocs(q);
    const studentsToday = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setStudents(studentsToday);
  };

  fetchAndMarkAbsent();
}, [todayStr]);


  // Fetch attendance records for current month for all students
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      // Get all attendance_records for this month
      const q = query(
        collection(db, "attendance_records"),
        where("date", ">=", firstDay),
        where("date", "<=", lastDay)
      );
      const querySnapshot = await getDocs(q);
      // Map: student_id -> number of days present
      const map = {};
      querySnapshot.forEach(docSnap => {
        const { student_id, isPresent } = docSnap.data();
        if (!map[student_id]) map[student_id] = 0;
        if (isPresent) map[student_id] += 1;
      });
      setAttendanceMap(map);
    };
    fetchAttendanceRecords();
  }, [firstDay, lastDay, students]);

  // Grade order for sorting
  const gradeOrder = {
    "Playgroup": 1,
    "Nursery": 2,
    "Pre primary I": 3
  };

  // Sort students by grade order
  const sortedStudents = [...students].sort((a, b) => {
    return (gradeOrder[a.grade] || 99) - (gradeOrder[b.grade] || 99);
  });

  // Grades to show in dashboard cards
  const grades = ["Playgroup", "Nursery", "Pre primary I"];

  // Calculate per-grade stats
  const attendanceByGrade = grades.map(grade => {
    const studentsInGrade = students.filter(s => s.grade === grade);
    const presentCount = studentsInGrade.filter(s => s.isPresent).length;
    const totalCount = studentsInGrade.length;
    const percentage = totalCount ? ((presentCount / totalCount) * 100).toFixed(1) : "0.0";
    let avatar = "👶";
    if (grade === "Nursery") avatar = "👧";
    if (grade === "Pre primary I") avatar = "👦";
    return {
      grade,
      presentCount,
      totalCount,
      percentage,
      avatar
    };
  });

  // Calculate overall stats
  const totalPresent = students.filter(s => s.isPresent).length;
  const totalStudents = students.length;

  // Dynamic attendance update
  const handleAttendanceChange = async (studentId, isPresent, studentObj) => {
    try {
      // Update isPresent in students collection (for UI consistency)
      await updateDoc(doc(db, "students", studentId), { isPresent });

      // Update or create attendance_records for today
      // Find if attendance_records entry exists for this student and today
      const attendanceQ = query(
        collection(db, "attendance_records"),
        where("student_id", "==", studentObj.student_id),
        where("date", "==", todayStr)
      );
      const attendanceSnapshot = await getDocs(attendanceQ);
      if (!attendanceSnapshot.empty) {
        // Update existing record
        attendanceSnapshot.forEach(async (docSnap) => {
          await updateDoc(doc(db, "attendance_records", docSnap.id), { isPresent });
        });
      } else {
        // Create new record
        await collection(db, "attendance_records").add({
          student_id: studentObj.student_id,
          date: todayStr,
          isPresent
        });
      }

      // Update UI
      setStudents(prev =>
        prev.map(s =>
          s.id === studentId ? { ...s, isPresent } : s
        )
      );
      // Refetch attendance records for the month
      // (Optional: you can trigger fetchAttendanceRecords here if needed)
    } catch (error) {
      alert("Failed to update attendance: " + error.message);
    }
  };

  const handleDailyReportClick = () => {
    navigate('/daily-reports');
  };
  const handleChildDataClick = () => {
    navigate('/child-report');
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '0',
      margin: '0'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e0e6ed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <img src={giraffeIcon} alt="logo" className="login-logo" />
          <nav style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ color: '#8b5cf6', fontWeight: '500', cursor: 'pointer' }}>Home</span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={handleDailyReportClick}
            >
              Daily Report
            </span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={() => navigate('/reports')}
            >
              Reports
            </span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={handleChildDataClick}
            >
              Child Data
            </span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={() => navigate('/themes')}
            >
              Theme
            </span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={() => navigate('/fees')}
            >
              Fees
            </span>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>Inbox</span>
            <Bell size={16} />
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            👩
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {/* Welcome Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            color: '#374151',
            margin: '0'
          }}>
            Welcome <span style={{ fontWeight: 'bold' }}>Hema,</span>
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Camera size={16} />
              Gallery
            </button>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Calendar size={16} />
              Holidays 🎉
            </button>
            <button style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Logout ↗
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Today's Attendance Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Calendar size={20} color="#3b82f6" />
              <h3 style={{
                color: '#3b82f6',
                fontSize: '1.25rem',
                margin: '0'
              }}>Today Attendance</h3>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <Calendar size={16} color="#6b7280" />
              <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div style={{
              fontSize: '1.5rem',
              color: '#3b82f6',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              {totalPresent}/{totalStudents} present
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: totalStudents ? `${(totalPresent / totalStudents) * 100}%` : '0%',
                height: '100%',
                background: 'linear-gradient(90deg, #84cc16 0%, #65a30d 100%)',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>

          {/* Grade Statistics */}
          {attendanceByGrade.map(({ grade, presentCount, totalCount, percentage, avatar }, idx) => (
            <div key={grade} style={{
              backgroundColor: idx === 0 ? '#84cc16' : idx === 1 ? '#f59e0b' : '#f87171',
              borderRadius: '12px',
              padding: '1.5rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {avatar}
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>{presentCount}</div>
              <div style={{
                fontSize: '0.875rem',
                marginBottom: '0.25rem'
              }}>{percentage}% of the class</div>
              <div style={{
                fontSize: '0.875rem',
                opacity: '0.8'
              }}>Grade:</div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>{grade}</div>
            </div>
          ))}
        </div>

        {/* Student Record Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            color: '#374151',
            marginBottom: '1.5rem'
          }}>Student Record:</h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Full Name</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Grade</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Attendance</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>In - time</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Out - time</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Present</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>Absent</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => {
                  // Attendance for the month
                  const presentDays = attendanceMap[student.student_id] || 0;
                  return (
                    <tr key={student.id} style={{
                      backgroundColor: index === 0 ? '#fef2f2' : index === 1 ? '#fefce8' : '#f0fdf4',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <td style={{
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          {student.avatar}
                        </div>
                        <span style={{
                          color: '#374151',
                          fontWeight: '500'
                        }}>{student.name}</span>
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#374151'
                      }}>{student.grade}</td>
                      <td style={{
                        padding: '1rem',
                        color: '#374151'
                      }}>
                        {presentDays} / {totalDays} 
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#374151'
                      }}>{student.inTime}</td>
                      <td style={{
                        padding: '1rem',
                        color: '#374151'
                      }}>{student.outTime}</td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: student.isPresent ? '#22c55e' : '#6b7280',
                            borderRadius: '4px',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleAttendanceChange(student.id, true, student)}
                          title="Mark Present"
                        >
                          ✓
                        </button>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: !student.isPresent ? '#ef4444' : '#6b7280',
                            borderRadius: '4px',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleAttendanceChange(student.id, false, student)}
                          title="Mark Absent"
                        >
                          ✓
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
