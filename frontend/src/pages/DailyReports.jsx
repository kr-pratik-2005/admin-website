import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Search } from 'lucide-react';
import giraffeIcon from "../assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, getDocs, Timestamp, doc, setDoc,query,where } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

export default function DailyReports() {
  const navigate = useNavigate();
  const [studentsList, setStudentsList] = useState([]);
  const today = new Date().toISOString().slice(0, 10);
  const location = useLocation();
  function formatInTime(rawTime) {
  if (!rawTime) return '';
  const date = new Date(`1970-01-01T${rawTime}`);
  if (isNaN(date.getTime())) return ''; // invalid format fallback
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
function convertTo24HourTime(time12h) {
  if (!time12h) return '';
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (modifier.toLowerCase() === 'pm' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier.toLowerCase() === 'am' && hours === '12') {
    hours = '00';
  }

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}


useEffect(() => {
  const fetchThemeOfDay = async () => {
    try {
      const auth = getAuth(); // 👈 if not already imported, add this
      const teacherId = auth.currentUser?.email || "default_teacher";
      const ref = doc(db, "daily_themes", teacherId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const dayThemes = snap.data()[today];
        if (dayThemes) {
          // Flatten all tags from all selected categories into a single list
          const allTags = Object.values(dayThemes).flat();
          setForm(prev => ({ ...prev, theme: allTags }));
        }
      }
    } catch (err) {
      console.error("Error loading theme of the day:", err);
    }
  };

  fetchThemeOfDay();
}, [today]);



  // Fetch students from Firestore (only present students with inTime)
  useEffect(() => {
  if (location.state) {
    const { student_id, name, inTime } = location.state;
    setForm(prev => ({
      ...prev,
      student_id,
      name,
      inTime
    }));
  }
}, [location.state]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Get all attendance records for today
        const attendanceSnapshot = await getDocs(collection(db, "attendance_records"));
        const presentAttendance = attendanceSnapshot.docs
          .map(doc => doc.data())
          .filter(a => a.date === today && a.isPresent);
        const presentStudentIds = presentAttendance.map(a => a.student_id);

        // Get student details for present students, including inTime
        const studentsSnapshot = await getDocs(collection(db, "students"));
        const allStudents = studentsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        const presentStudents = allStudents.filter(s => presentStudentIds.includes(s.student_id));
        setStudentsList(presentStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [today]);

  const [search, setSearch] = useState('');
  const [date, setDate] = useState(today);
  const [form, setForm] = useState({
    student_id: '',
    name: '',
    inTime: '',
    outTime: '',
    snacks: '',
    meal: '',
    sleep: false,
    sleepFrom: '',
    sleepTo: '',
    diaperChanged: false,
    noDiaper: false,
    diaperTimes: 1,
    poops: 1,
    feelings: [],
    learning: '',
    teacherNote: '',
    ouch: { student: '', incident: '', comment: '' },
    incident: { student: '', description: '', comment: '' },
    theme: [],
    themeDetails: Array(5).fill(''),
  });

  // Options
  const feelingsOptions = [
    "Curious", "Attentive", "Interactive", "Naughty", "Active", "Disinterested"
  ];
  const learningOptions = [
    "Developing Skills", "Completed With Assistance", "Completed Independently"
  ];
  

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
 if (name === "student_id") {
  const fetchStudent = async () => {
    try {
      const q = query(collection(db, "students"), where("student_id", "==", value));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const studentData = snapshot.docs[0].data();
        setForm(prev => ({
          ...prev,
          student_id: value,
          name: studentData.name || '',
          inTime: convertTo24HourTime(studentData.inTime || ''), // 💡 convert here
          outTime: '',
        }));
      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };
  fetchStudent();
}

 else if (name.startsWith("ouch.") || name.startsWith("incident.")) {
      const [section, field] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFeelings = (feeling) => {
    setForm((prev) => ({
      ...prev,
      feelings: prev.feelings.includes(feeling)
        ? prev.feelings.filter((f) => f !== feeling)
        : [...prev.feelings, feeling],
    }));
  };

  const handleLearning = (option) => {
    setForm((prev) => ({ ...prev, learning: option }));
  };

  const handleTheme = (tag) => {
    setForm((prev) => ({
      ...prev,
      theme: prev.theme.includes(tag)
        ? prev.theme.filter((t) => t !== tag)
        : [...prev.theme, tag],
    }));
  };

  const handleThemeDetail = (i, value) => {
    setForm((prev) => {
      const arr = [...prev.themeDetails];
      arr[i] = value;
      return { ...prev, themeDetails: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedStudentId = form.student_id;
    if (!selectedStudentId) {
      alert("Please select a child before submitting the report.");
      return;
    }
    const reportId = `${selectedStudentId}_${today}`;
    const reportData = {
      ...form,
      student_id: selectedStudentId,
      date: today,
      submittedAt: Timestamp.now()
    };
    try {
      await setDoc(doc(db, "daily_reports", reportId), reportData);
      alert("Report submitted");
      setForm({
        student_id: '',
        name: '',
        inTime: '',
        outTime: '',
        snacks: '',
        meal: '',
        sleep: false,
        sleepFrom: '',
        sleepTo: '',
        diaperChanged: false,
        noDiaper: false,
        diaperTimes: 1,
        poops: 1,
        feelings: [],
        learning: '',
        teacherNote: '',
        ouch: { student: '', incident: '', comment: '' },
        incident: { student: '', description: '', comment: '' },
        theme: [],
        themeDetails: Array(5).fill(''),
      });
    } catch (error) {
      alert("Failed to submit report: " + error.message);
    }
  };

  const handleNav = (route) => {
    if (route) navigate(route);
  };

  return (
    <div className="daily-bg">
      {/* Header */}
      <header className="daily-header">
        <div className="header-left">
          <img src={giraffeIcon} alt="logo" className="daily-logo" />
          <nav className="nav-links">
            <span className="nav-link" onClick={() => handleNav('/home')}>Home</span>
            <span className="nav-active">Daily Reports</span>
            <span
              style={{ color: '#6b7280', cursor: 'pointer' }}
              onClick={() => navigate('/reports')}
            >
              Reports
            </span>
            <span className="nav-link" onClick={() => handleNav('/child-profile/child-report')}>Child Data</span>
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
        <div className="header-right">
          <div className="search-calendar">
            <div className="search-box">
              <Search size={18} color="#6b7280" />
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="calendar-box">
              <Calendar size={18} color="#6b7280" />
              <input
                type="date"
                className="calendar-input"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="profile-avatar">👩</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="daily-main">
        <h2 className="main-title">Daily reports:</h2>
        <form onSubmit={handleSubmit} className="daily-form">
          {/* Name */}
          <div className="row">
            <label>Name</label>
            <select
              className="input"
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
            >
              <option value="">Select Child</option>
              {studentsList.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.name} ({s.student_id})
                </option>
              ))}
            </select>
          </div>
          {/* In/Out Time */}
          <div className="row time-row">
            <div>
              <label>In</label>
              <input
                type="time"
                className="input"
                name="inTime"
                value={form.inTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Out</label>
              <input
                type="time"
                className="input"
                name="outTime"
                value={form.outTime}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Snacks */}
          <div className="row">
            <label>Child Ate - Snacks</label>
            <div className="btn-group">
              {["None", "Half", "Most", "All"].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={form.snacks === val ? "btn selected" : "btn"}
                  onClick={() => setForm((prev) => ({ ...prev, snacks: val }))}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          {/* Meal */}
          <div className="row">
            <label>Child Ate - Meal</label>
            <div className="btn-group">
              {["None", "Half", "Most", "All"].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={form.meal === val ? "btn selected" : "btn"}
                  onClick={() => setForm((prev) => ({ ...prev, meal: val }))}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          {/* Sleep */}
          <div className="row sleep-row">
            <label>
              <input
                type="checkbox"
                name="sleep"
                checked={form.sleep}
                onChange={handleChange}
              />
              Child didn't sleep in the school
            </label>
            <div className="time-range">
              <label>From</label>
              <input
                type="time"
                className="input"
                name="sleepFrom"
                value={form.sleepFrom}
                onChange={handleChange}
                disabled={form.sleep}
              />
              <label>To</label>
              <input
                type="time"
                className="input"
                name="sleepTo"
                value={form.sleepTo}
                onChange={handleChange}
                disabled={form.sleep}
              />
            </div>
          </div>
          {/* Diaper */}
          <div className="row">
            <label>
              <input
                type="checkbox"
                name="diaperChanged"
                checked={form.diaperChanged}
                onChange={handleChange}
              />
              Child Diaper Was Changed
            </label>
            <label>
              <input
                type="checkbox"
                name="noDiaper"
                checked={form.noDiaper}
                onChange={handleChange}
              />
              No diaper changed
            </label>
            <div className="inline">
              <label>No of times</label>
              <input
                type="number"
                min={0}
                className="input small"
                name="diaperTimes"
                value={form.diaperTimes}
                onChange={handleChange}
              />
              <label>No of Poops</label>
              <input
                type="number"
                min={0}
                className="input small"
                name="poops"
                value={form.poops}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Feelings */}
          <div className="row">
            <label>Child Was Feeling</label>
            <div className="btn-group feelings">
              {feelingsOptions.map((f) => (
                <button
                  type="button"
                  key={f}
                  className={form.feelings.includes(f) ? "btn selected" : "btn"}
                  onClick={() => handleFeelings(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {/* Learning */}
          <div className="row">
            <label>Learning Updates</label>
            <div className="btn-group">
              {learningOptions.map((l) => (
                <button
                  type="button"
                  key={l}
                  className={form.learning === l ? "btn selected" : "btn"}
                  onClick={() => handleLearning(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          {/* Teacher Note */}
          <div className="row">
            <label>Teachers Note</label>
            <textarea
              className="input"
              name="teacherNote"
              value={form.teacherNote}
              onChange={handleChange}
              placeholder="Type any keywords"
              rows={2}
            />
          </div>
          {/* Ouch & Incident */}
          <div className="row group-row">
            <div className="group">
              <label>Ouch Report</label>
              <input
                className="input"
                type="text"
                placeholder="Name of the student"
                name="ouch.student"
                value={form.ouch.student}
                onChange={handleChange}
              />
              <textarea
                className="input"
                placeholder="Incident"
                name="ouch.incident"
                value={form.ouch.incident}
                onChange={handleChange}
                rows={1}
              />
              <textarea
                className="input"
                placeholder="Additional Comments"
                name="ouch.comment"
                value={form.ouch.comment}
                onChange={handleChange}
                rows={1}
              />
            </div>
            <div className="group">
              <label>Incident Report</label>
              <input
                className="input"
                type="text"
                placeholder="Name of the student"
                name="incident.student"
                value={form.incident.student}
                onChange={handleChange}
              />
              <textarea
                className="input"
                placeholder="Description of injury"
                name="incident.description"
                value={form.incident.description}
                onChange={handleChange}
                rows={1}
              />
              <textarea
                className="input"
                placeholder="Additional Comments"
                name="incident.comment"
                value={form.incident.comment}
                onChange={handleChange}
                rows={1}
              />
            </div>
          </div>
          {/* Theme of the day */}
          <div className="row">
            <label>Theme of the day</label>
            <div className="theme-tags">
              {form.theme.map((tag) => (
  <button
    type="button"
    key={tag}
    className="btn selected small"
    onClick={() => handleTheme(tag)}
  >
    {tag}
  </button>
))}

            </div>
            {form.theme.map((tag, i) => (
  <input
    key={i}
    className="input"
    type="text"
    placeholder={`Theme detail ${i + 1}`}
    value={form.themeDetails[i] || ''}
    onChange={(e) => handleThemeDetail(i, e.target.value)}
    style={{ marginTop: 6 }}
  />
))}

          </div>
          {/* Buttons */}
          <div className="row btn-row">
            <button type="button" className="back-btn" onClick={() => navigate('/home')}>
              Back Home
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </main>
  


      {/* CSS */}
      <style>{`
        .daily-bg {
          min-height: 100vh;
          background: #f5f7fa;
        }
        .daily-header {
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
        .daily-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link, .nav-active {
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
        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .search-calendar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .search-box, .calendar-box {
          display: flex;
          align-items: center;
          background: #f3f4f6;
          padding: 0.2rem 0.7rem;
          border-radius: 8px;
          gap: 0.4rem;
        }
        .search-input, .calendar-input {
          background: transparent;
          border: none;
          font-size: 1rem;
          outline: none;
          padding: 0.4rem 0.2rem;
          min-width: 90px;
        }
        .calendar-input {
          min-width: 120px;
        }
        .inbox {
          background-color: #f3f4f6;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
        }
        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #fbbf24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .daily-main {
          max-width: 500px;
          margin: 2.5rem auto;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          padding: 36px 24px 24px 24px;
        }
        .main-title {
          font-size: 1.35rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 24px;
          text-align: center;
        }
        .daily-form .row {
          margin-bottom: 18px;
        }
        .row label {
          font-weight: 500;
          color: #444;
          margin-bottom: 6px;
          display: block;
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
        .btn-group {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .btn {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          color: #555;
          border-radius: 7px;
          padding: 7px 16px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .btn.selected, .btn.selected.small {
          background: #ffd86b;
          color: #fff;
          border-color: #ffd86b;
        }
        .btn.small {
          font-size: 0.96rem;
          padding: 6px 10px;
        }
        .btn-group.feelings {
          flex-wrap: wrap;
          gap: 6px;
        }
        .row.sleep-row {
          display: flex;
          flex-direction: column;
        }
        .time-row {
          display: flex;
          gap: 18px;
        }
        .time-row > div {
          flex: 1;
        }
        .time-range {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }
        .inline {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
        }
        .input.small {
          width: 50px;
          padding: 7px 6px;
        }
        .group-row {
          display: flex;
          gap: 16px;
        }
        .group {
          flex: 1;
          background: #f6f7fa;
          border-radius: 10px;
          padding: 10px 12px;
        }
        .theme-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .btn-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: stretch;
        }
        .back-btn {
          background: #f3f4f6;
          color: #888;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
        }
        .submit-btn {
          background: #ffd86b;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(255,216,107,0.09);
        }
        @media (max-width: 900px) {
          .daily-main {
            margin: 2.5rem 1vw;
          }
        }
        @media (max-width: 700px) {
          .daily-header {
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
          .daily-main {
            padding: 16px 2vw 16px 2vw;
          }
          .group-row {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
