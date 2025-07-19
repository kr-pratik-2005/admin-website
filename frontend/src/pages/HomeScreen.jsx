import React, { useState, useEffect, useRef } from 'react';
import { Bell, Calendar, Camera } from 'lucide-react';
import giraffeIcon from "../assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import {
  collection, getDocs, query, where, doc, updateDoc, addDoc, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [allMessages, setAllMessages] = useState([]);

  const navigate = useNavigate();
 const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
const [announcementText, setAnnouncementText] = useState('');
const [sending, setSending] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month, totalDays).toISOString().split('T')[0];

  const [showLeaveRequestsModal, setShowLeaveRequestsModal] = useState(false);
const [leaveRequests, setLeaveRequests] = useState([]);
const [loadingLeaves, setLoadingLeaves] = useState(false);

  // Midnight Reset Logic
  const lastCheckedDateRef = useRef(todayStr);

useEffect(() => {
  // Check every minute if the day has changed
  const interval = setInterval(async () => {
    const now = new Date();
    // Get date in YYYY-MM-DD format
    const currentDate = now.toISOString().split('T')[0];
    if (lastCheckedDateRef.current !== currentDate) {
      // Date changed! It's a new day.
      try {
        // Set all students to isPresent: false, inTime: null
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const batchUpdates = studentsSnapshot.docs.map(docSnap => {
          return updateDoc(doc(db, "students", docSnap.id), {
            isPresent: false,
            inTime: null
          });
        });
        await Promise.all(batchUpdates);

        // Optionally refresh the state
        const refreshed = await getDocs(collection(db, "students"));
        setStudents(refreshed.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        console.error("Failed to reset attendance and inTime after 12am:", error);
      }
      lastCheckedDateRef.current = currentDate;
    }
  }, 60000); // run every minute

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
  if (showLeaveRequestsModal) {
    setLoadingLeaves(true);
    getDocs(collection(db, 'leave_requests'))
      .then(snapshot => {
        const leaves = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // optional: sort by date_submitted descending
        leaves.sort((a, b) => (b.date_submitted || '').localeCompare(a.date_submitted || ''));
        setLeaveRequests(leaves);
      })
      .catch(err => {
        alert('Failed to load leave requests');
        setLeaveRequests([]);
        console.error(err);
      })
      .finally(() => setLoadingLeaves(false));
  }
}, [showLeaveRequestsModal]);

const handleStudentNameClick = (student) => {
  if (!student.isPresent) {
    alert('Student is not marked present yet');
    return;
  }
  navigate('/daily-reports', {
    state: {
      student_id: student.student_id,
      name: student.name,
      inTime: student.inTime || ''
    }
  });
};

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      if (lastCheckedDateRef.current !== currentDate) {
        try {
          const studentsSnapshot = await getDocs(collection(db, "students"));
          const batchUpdates = studentsSnapshot.docs.map(docSnap => {
            return updateDoc(doc(db, "students", docSnap.id), {
              isPresent: false,
              inTime: null
            });
          });
          await Promise.all(batchUpdates);

          const refreshed = await getDocs(collection(db, "students"));
          setStudents(refreshed.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })));
        } catch (error) {
          console.error("Failed to reset attendance and inTime after 12am:", error);
        }
        lastCheckedDateRef.current = currentDate;
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  // Inbox: Fetch all messages and count unread
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("to", "==", "demouser@gmail.com")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      msgs.sort((a, b) => {
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      });
      setAllMessages(msgs);
      setUnreadCount(msgs.filter(msg => !msg.read).length);
    });

    return () => unsubscribe();
  }, []);

  // Fetch students and mark absent if not marked
  useEffect(() => {
    const fetchAndMarkAbsent = async () => {
      try {
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const allStudents = studentsSnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));

        for (const student of allStudents) {
          const attendanceQ = query(
            collection(db, "attendance_records"),
            where("student_id", "==", student.student_id),
            where("date", "==", todayStr)
          );
          const attendanceSnapshot = await getDocs(attendanceQ);

          if (attendanceSnapshot.empty) {
            await addDoc(collection(db, "attendance_records"), {
              student_id: student.student_id,
              date: todayStr,
              isPresent: false
            });
            await updateDoc(doc(db, "students", student.id), { isPresent: false });
          }
        }

        const querySnapshot = await getDocs(collection(db, "students"));
        const studentsToday = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsToday);
      } catch (err) {
        console.error("Error during fetchAndMarkAbsent:", err);
      }
    };

    fetchAndMarkAbsent();
  }, [todayStr]);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const q = query(
        collection(db, "attendance_records"),
        where("date", ">=", firstDay),
        where("date", "<=", lastDay)
      );
      const querySnapshot = await getDocs(q);
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

  const gradeOrder = {
    "Playgroup": 1,
    "Nursery": 2,
    "Pre primary I": 3,
    "Pre primary II": 4,
  "Pre primary III": 5
  };

  const sortedStudents = [...students].sort((a, b) => {
    return (gradeOrder[a.grade] || 99) - (gradeOrder[b.grade] || 99);
  });

  const markMessageAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "messages", id), { read: true });
      setAllMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg));
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    try {
      await addDoc(collection(db, 'messages'), {
        from: 'demouser@gmail.com',
        to: replyToMessage.from,
        message: replyText,
        timestamp: serverTimestamp(),
        read: false
      });
      alert('✅ Reply sent!');
      setReplyText('');
      setShowReplyBox(false);
      setReplyToMessage(null);
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('❌ Failed to send reply');
    }
  };

const grades = ["Playgroup", "Nursery", "Pre primary I", "Pre-primary-II", "Pre-primary-III"];

  const attendanceByGrade = grades.map(grade => {
    const studentsInGrade = students.filter(s => s.grade === grade);
    const presentCount = studentsInGrade.filter(s => s.isPresent).length;
    const totalCount = studentsInGrade.length;
    const percentage = totalCount ? ((presentCount / totalCount) * 100).toFixed(1) : "0.0";
    let avatar = "👶";
    if (grade === "Nursery") avatar = "👧";
    if (grade === "Pre primary I") avatar = "👦";
    if (grade === "Pre primary II") avatar = "🧒";
  if (grade === "Pre primary III") avatar = "🧑";
    return {
      grade,
      presentCount,
      totalCount,
      percentage,
      avatar
    };
  });

  const totalPresent = students.filter(s => s.isPresent).length;
  const totalStudents = students.length;

  const handleAttendanceChange = async (studentId, isPresent, studentObj) => {
    try {
      await updateDoc(doc(db, "students", studentId), {
        isPresent,
        inTime: isPresent ? new Date().toLocaleTimeString() : studentObj.inTime
      });

      const attendanceQ = query(
        collection(db, "attendance_records"),
        where("student_id", "==", studentObj.student_id),
        where("date", "==", todayStr)
      );
      const attendanceSnapshot = await getDocs(attendanceQ);

      if (!attendanceSnapshot.empty) {
        const docRef = doc(db, "attendance_records", attendanceSnapshot.docs[0].id);
        await updateDoc(docRef, { isPresent });
      } else {
        await addDoc(collection(db, "attendance_records"), {
          student_id: studentObj.student_id,
          date: todayStr,
          isPresent
        });
      }

      setStudents(prev =>
        prev.map(s =>
          s.id === studentId ? { ...s, isPresent, inTime: isPresent ? new Date().toLocaleTimeString() : s.inTime } : s
        )
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance: " + error.message);
    }
  };

  const handleDailyReportClick = (student) => {
     navigate('/daily-reports', {
    state: {
      student_id: student.student_id,
      name: student.name,
      inTime: student.inTime || ''
    }
  });
  };

  const handleChildDataClick = () => {
    navigate("/child-profile/child-report");

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
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                backgroundColor: '#f3f4f6',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setInboxOpen(prev => !prev)}
            >
              <span>Inbox</span>
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
            {inboxOpen && (
              <div style={{
                position: 'absolute',
                top: '2.5rem',
                right: 0,
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '8px',
                zIndex: 1000,
                width: '350px',
                maxHeight: '350px',
                overflowY: 'auto',
                padding: '1rem'
              }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>Inbox</h4>
                {allMessages.length === 0 ? (
                  <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>No messages</p>
                ) : (
                  allMessages.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        paddingBottom: '0.5rem',
                        marginBottom: '0.5rem',
                        backgroundColor: !msg.read ? '#fef9c3' : 'transparent',
                        boxShadow: !msg.read ? '0 0 8px #fde047' : 'none',
                        borderRadius: '6px'
                      }}
                    >
                      <p style={{
                        margin: '0.25rem 0',
                        fontWeight: '500',
                        color: !msg.read ? '#b45309' : '#374151'
                      }}>
                        From: {msg.from}
                      </p>
                      <p style={{
                        margin: '0.25rem 0',
                        fontWeight: !msg.read ? 'bold' : 'normal'
                      }}>
                        {msg.message}
                      </p>
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        margin: '0.25rem 0'
                      }}>
                        {msg.timestamp?.seconds
                          ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
                          : ''}
                      </p>
                      {!msg.read && (
                        <button
                          onClick={() => markMessageAsRead(msg.id)}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            marginRight: '0.5rem',
                            marginTop: '0.25rem'
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setReplyToMessage(msg);
                          setShowReplyBox(true);
                        }}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
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
            <button
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onClick={() => navigate('/gallery')}
            >
              <Camera size={16} />
              Gallery
            </button>
            <button
    style={{
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}
    onClick={() => setShowLeaveRequestsModal(true)}
  >
    📝 Leave Requests
  </button>
            <button
  style={{
    backgroundColor: '#8b5cf6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  }}
  onClick={() => setShowAnnouncementModal(true)}
>
  Make an Announcement 🗣️
</button>

            <button
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onClick={() => navigate('/holidays')}
            >
              <Calendar size={16} />
              Holidays 🎉
            </button>
            <button
              style={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onClick={() => navigate('/')}
            >
              Logout
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
  <span
    onClick={() => handleStudentNameClick(student)}
    style={{
      color: '#374151',
      fontWeight: '500',
      textDecoration: 'underline',
      cursor: 'pointer'
    }}
  >
    {student.name}
  </span>
</td>


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
      {showReplyBox && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Reply to {replyToMessage?.from}</h3>
            <textarea
              rows={4}
              style={{ width: '100%', marginBottom: '1rem' }}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={sendReply} style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}>
                Send
              </button>
              <button onClick={() => setShowReplyBox(false)} style={{
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showAnnouncementModal && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 3000
  }}>
    <div style={{
      background: 'white', padding: '2rem', borderRadius: '8px',
      minWidth: '350px', maxWidth: '90%'
    }}>
      <h2>Make an Announcement</h2>
      <textarea
        rows={4}
        style={{ width: '100%', marginBottom: '1rem' }}
        placeholder="Type your announcement here..."
        value={announcementText}
        onChange={e => setAnnouncementText(e.target.value)}
        disabled={sending}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button
          onClick={async () => {
            if (!announcementText.trim()) return;
            setSending(true);
            try {
              await addDoc(collection(db, "announcements"), {
                from: "demouser@gmail.com",
                date: new Date().toISOString(),
                message: announcementText,
                timestamp: serverTimestamp()
              });
              alert('Announcement sent!');
              setShowAnnouncementModal(false);
              setAnnouncementText('');
            } catch (err) {
              alert('Failed to send announcement');
              console.error(err);
            }
            setSending(false);
          }}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: sending ? 'not-allowed' : 'pointer'
          }}
          disabled={sending}
        >Send</button>
        <button
          onClick={() => setShowAnnouncementModal(false)}
          style={{
            backgroundColor: '#e5e7eb',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
        >Cancel</button>
      </div>
    </div>
  </div>
)}
{/* ===== Leave Requests Modal ===== */}
{showLeaveRequestsModal && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 3000
  }}>
    <div style={{
      background: 'white', borderRadius: '8px', padding: '2rem',
      minWidth: '350px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'
    }}>
      <h2>Leave Requests</h2>
      <button
        onClick={() => setShowLeaveRequestsModal(false)}
        style={{
          position: 'absolute', top: '24px', right: '32px',
          background: 'transparent', border: 'none', color: '#888', fontSize: 26, cursor: 'pointer'
        }}
        aria-label="Close"
      >×</button>

      {loadingLeaves ? (
        <p>Loading leave requests...</p>
      ) : (
        <>
          {leaveRequests.length === 0 ? (
            <p>No leave requests found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th style={{ padding: '0.5rem', fontWeight: 600 }}>Student ID</th>
                  <th style={{ padding: '0.5rem', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '0.5rem', fontWeight: 600 }}>From</th>
                  <th style={{ padding: '0.5rem', fontWeight: 600 }}>To</th>
                  <th style={{ padding: '0.5rem', fontWeight: 600 }}>Reason</th>
                  <th style={{ padding: '0.5rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.5rem', fontWeight: 600 }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(req => (
                  <tr key={req.id}>
                    <td style={{ padding: '0.5rem' }}>{req.student_id}</td>
                    <td style={{ padding: '0.5rem' }}>
                      {req.today_leave !== null ? "Today's Leave" : "Future Leave"}
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      {req.today_leave !== null ? req.today_leave : req.future_from}
                    </td>
                    <td style={{ padding: '0.5rem' }}>
                      {req.today_leave !== null ? req.today_leave : req.future_to}
                    </td>
                    <td style={{ padding: '0.5rem', maxWidth: 100 }}>{req.today_leave !== null ? req.today_reason : req.future_reason}</td>
                    <td style={{ padding: '0.5rem' }}>{req.status}</td>
                    <td style={{ padding: '0.5rem', minWidth: 130 }}>
                      {req.date_submitted ? new Date(req.date_submitted).toLocaleString() : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  </div>
)}


    </div>
  );
};

export default HomeScreen;