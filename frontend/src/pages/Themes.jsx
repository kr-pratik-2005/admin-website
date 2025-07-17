import React, { useState, useEffect } from "react";
import giraffeIcon from "../assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";

export default function Themes() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const teacherId = user?.email || "default_teacher";
  const [checkedSections, setCheckedSections] = useState([]);
  const toggleCheckbox = (section) => {
  setCheckedSections(prev => 
    prev.includes(section)
      ? prev.filter(s => s !== section) // untick
      : [...prev, section]              // tick
  );
};

const [showClearModal, setShowClearModal] = useState(false);


  const [selectedClass, setSelectedClass] = useState("Playgroup");
  const [theme, setTheme] = useState("");
  const [category, setCategory] = useState("Language Development");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });

  const [themeOfWeek, setThemeOfWeek] = useState(null);
  const [themeOfDay, setThemeOfDay] = useState(null);

  const sectionList = [
    "Language Development",
    "Numeracy Development",
    "Fine motor center -Art",
    "Gross motor center - Movement",
    "Pretend play",
    "Story Telling",
  ];

  const defaultStructure = sectionList.reduce((acc, section) => {
    acc[section] = [];
    return acc;
  }, {});

  const handleAddTag = () => {
    if (!theme.trim()) return;

    setThemeOfWeek(prev => {
      const copy = { ...prev };
      if (!copy[category]) copy[category] = [];
      if (!copy[category].includes(theme.trim())) {
        copy[category] = [...copy[category], theme.trim()];
      }
      return copy;
    });

    setThemeOfDay(prev => {
      const copy = { ...prev };
      if (!copy[category]) copy[category] = [];
      if (!copy[category].includes(theme.trim())) {
        copy[category] = [...copy[category], theme.trim()];
      }
      return copy;
    });

    setTheme("");
  };
function getWeekNumber(date) {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(copy.getUTCFullYear(),0,1));
  return Math.ceil((((copy - yearStart) / 86400000) + 1) / 7);
}

const [weekNumber, setWeekNumber] = useState(() => getWeekNumber(new Date()));

useEffect(() => {
  setWeekNumber(getWeekNumber(new Date(selectedDate)));
}, [selectedDate]);
  const handleRemoveTag = (section, tagToRemove, source) => {
    if (source === "week") {
      setThemeOfWeek(prev => ({
        ...prev,
        [section]: prev[section].filter(tag => tag !== tagToRemove)
      }));
      setThemeOfDay(prev => ({
        ...prev,
        [section]: prev[section]?.filter(tag => tag !== tagToRemove) || []
      }));
    } else if (source === "day") {
      setThemeOfDay(prev => ({
        ...prev,
        [section]: prev[section].filter(tag => tag !== tagToRemove)
      }));
    }
  };
 


  const saveThemeData = async () => {
    try {
      await setDoc(doc(db, "weekly_tags", teacherId), {
        themeOfWeek,
        selectedClass
      });

      await setDoc(doc(db, "daily_themes", teacherId), {
        [selectedDate]: themeOfDay,selectedClass
      }, { merge: true });

      alert("Themes saved to Firebase ✅");
    } catch (err) {
      console.error("Error saving themes:", err);
    }
  };

  useEffect(() => {
    const loadThemeData = async () => {
      try {
        const weekSnap = await getDoc(doc(db, "weekly_tags", teacherId));
        const weekData = weekSnap.exists() ? weekSnap.data().themeOfWeek : defaultStructure;
        setThemeOfWeek(weekData);

        const daySnap = await getDoc(doc(db, "daily_themes", teacherId));
        const allDays = daySnap.exists() ? daySnap.data() : {};
        const todayData = allDays[selectedDate] || structuredClone(weekData);
        setThemeOfDay(todayData);
      } catch (error) {
        console.error("Error loading data:", error);
        setThemeOfWeek(defaultStructure);
        setThemeOfDay(defaultStructure);
      }
    };

    loadThemeData();
  }, [selectedDate]);

  if (!themeOfWeek || !themeOfDay) return <div>Loading themes...</div>;

  return (
    <div className="themes-bg">
      <header className="themes-header">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <img src={giraffeIcon} alt="logo" className="themes-logo" />
          <nav style={{ display: "flex", gap: "2rem" }}>
            <span onClick={() => navigate("/home")} style={{ color: "#6b7280", fontWeight: "500", cursor: "pointer" }}>Home</span>
            <span onClick={() => navigate("/daily-reports")} style={{ color: "#6b7280", fontWeight: "500", cursor: "pointer" }}>Daily Reports</span>
            <span onClick={() => navigate("/reports")} style={{ color: "#6b7280", cursor: "pointer" }}>Reports</span>
            <span onClick={() => navigate("/child-profile/child-report")} style={{ color: "#6b7280", cursor: "pointer" }}>Child Data</span>
            <span style={{ color: "#8b5cf6", fontWeight: "500", cursor: "pointer" }}>Theme</span>
            <span onClick={() => navigate("/fees")} style={{ color: "#6b7280", cursor: "pointer" }}>Fees</span>
          </nav>
        </div>
        <div style={{ width: 44 }}></div>
      </header>

      <main className="themes-main">
        <h2 className="themes-title">Theme</h2>

        <div className="themes-form">
          <div className="themes-row">
            <label>Sort by age</label>
            <select className="themes-input" defaultValue="2 - 3 years">
              <option>2 - 3 years</option>
              <option>3 - 4 years</option>
              <option>4 - 5 years</option>
            </select>
            <select
              className="themes-input"
              style={{ width: 180 }}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="Playgroup">Playgroup</option>
              <option value="Nursery">Nursery</option>
              <option value="Pre-primary-I">Pre-primary-I</option>
              <option value="Pre-primary-II">Pre-primary-II</option>
              <option value="Pre-primary-III">Pre-primary-III</option>
            </select>
          </div>

          <div className="themes-row">
            <label>Theme of the week</label>
<input className="themes-input" style={{ width: 60 }} value={weekNumber} readOnly />
            <input
              className="themes-input"
              style={{ width: 180 }}
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="themes-row">
            <label>Enter theme here</label>
            <input
              className="themes-input"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              style={{ width: 180 }}
            />
          </div>

          <div className="themes-row">
  <label>Select Category</label>
  <select
    className="themes-input"
    value={category}
    onChange={e => setCategory(e.target.value)}
    style={{ width: 180 }}
  >
    {sectionList.map(s => (
      <option key={s}>{s}</option>
    ))}
  </select>
  <button className="add-tag-btn" type="button" onClick={handleAddTag}>
    Add Tag
  </button>
  <button
    className="clear-tags-btn"
    type="button"
    style={{
      marginLeft: "10px",
      background: "#f87171",
      color: "#fff",
      border: "none",
      borderRadius: "7px",
      padding: "8px 18px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer"
    }}
    onClick={() => setShowClearModal(true)}
  >
    Clear All Tags
  </button>
</div>
{showClearModal && (
  <div className="clear-modal-popup">
    <div style={{ marginBottom: 16, fontWeight: 500 }}>
      Are you sure you want to clear all tags?
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem" }}>
      <button
        style={{
          background: "#e5e7eb",
          color: "#444",
          border: "none",
          borderRadius: "6px",
          padding: "7px 16px",
          fontWeight: "500",
          cursor: "pointer"
        }}
        onClick={() => setShowClearModal(false)}
      >
        Cancel
      </button>
      <button
        style={{
          background: "#f87171",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "7px 16px",
          fontWeight: "500",
          cursor: "pointer"
        }}
        onClick={() => {
          setThemeOfWeek(defaultStructure);
          setThemeOfDay(defaultStructure);
          setShowClearModal(false);
        }}
      >
        Yes, Clear
      </button>
    </div>
  </div>
)}

        </div>

        {/* Section Tags Table */}
        <div className="themes-table-outer">
          <div className="themes-table">
            <div className="themes-table-row themes-table-header">
              <div className="themes-table-cell themes-table-cell-title">Section</div>
              <div className="themes-table-cell themes-table-cell-tags">Tags</div>
            </div>
            {sectionList.map(section => (
              <div className="themes-table-row" key={section}>
                <div className="themes-table-cell themes-table-cell-title">{section}</div>
                <div className="themes-table-cell themes-table-cell-tags">
                  {themeOfWeek[section]?.map(tag => (
                    <span className="themes-tag" key={tag}>
                      {tag}
                      <span className="tag-x" onClick={() => handleRemoveTag(section, tag, "week")} style={{ cursor: "pointer" }}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme of the Day */}
        <div className="themes-day">
          <div className="themes-day-title">Theme of the day</div>
          {sectionList.map(section => (
            <div className="themes-day-row" key={section}>
              <input
  type="checkbox"
  className="themes-checkbox"
  checked={checkedSections.includes(section)}
  onChange={() => toggleCheckbox(section)}
/>
              <span className="themes-day-label">{section}</span>
              <div className="themes-day-tags">
                {themeOfDay[section]?.map(tag => (
                  <span className="themes-tag" key={tag}>
                    {tag}
                    <span className="tag-x" onClick={() => handleRemoveTag(section, tag, "day")} style={{ cursor: "pointer" }}>×</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="themes-form-btns">
          <button className="cancel-btn">Cancel</button>
          <button className="save-btn" onClick={saveThemeData}>Save</button>
        </div>
      </main>
 

      {/* CSS */}
      <style>{`
        .themes-bg {
          min-height: 100vh;
          background: #eaf5fc;
        }
        .themes-header {
          background: #fff;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e0e6ed;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .themes-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .themes-main {
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
        .themes-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2.5rem;
        }
        .themes-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-bottom: 2.2rem;
        }
        .themes-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .themes-row label {
          width: 170px;
          color: #444;
          font-weight: 500;
        }
        .themes-input {
          background: #f7f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          padding: 8px 12px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .themes-input:focus {
          border: 1.5px solid #ffd86b;
          background: #fffbe7;
        }
        .add-tag-btn {
          background: #ffd86b;
          color: #fff;
          border: none;
          border-radius: 7px;
          padding: 8px 18px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-left: 10px;
        }
        .themes-table-outer {
          width: 100%;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }
        .themes-table {
          width: 98%;
          border-radius: 12px;
          background: #f7fafc;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
          overflow-x: auto;
        }
        .themes-table-row {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
        }
        .themes-table-header {
          background: #f3f8fc;
          font-weight: 600;
        }
        .themes-table-row:last-child {
          border-bottom: none;
        }
        .themes-table-cell {
          flex: 1;
          padding: 1.1rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.05rem;
        }
        .themes-table-cell-title {
          min-width: 240px;
          font-weight: 500;
        }
        .themes-table-cell-tags {
          flex: 2;
          flex-wrap: wrap;
        }
        .themes-tag {
          background: #eaf5fc;
          color: #2d5b8c;
          border-radius: 6px;
          padding: 4px 10px;
          margin-right: 6px;
          font-size: 0.97rem;
          display: inline-flex;
          align-items: center;
        }
        .tag-x {
          margin-left: 4px;
          color: #bdbdbd;
          font-size: 1.1em;
          cursor: pointer;
          font-weight: bold;
        }
        .themes-day {
          width: 100%;
          background: #f7fafc;
          border-radius: 12px;
          margin-bottom: 2.2rem;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
          padding: 1.2rem 1.5rem;
        }
        .themes-day-title {
          font-size: 1.18rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1.1rem;
        }
        .themes-day-row {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.8rem;
          background: #fff;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .themes-day-label {
          min-width: 190px;
          font-size: 1.05rem;
          color: #444;
        }
        .themes-day-tags {
          display: flex;
          gap: 0.4rem;
        }
        .themes-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #ffd86b;
        }
        .themes-form-btns {
          display: flex;
          gap: 1.2rem;
          justify-content: flex-end;
          width: 100%;
        }
        .cancel-btn {
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
        @media (max-width: 1200px) {
          .themes-main {
            max-width: 99vw;
            padding: 24px 2vw 24px 2vw;
          }
        }
        @media (max-width: 800px) {
          .themes-table-cell-title {
            min-width: 120px;
          }
        }
        @media (max-width: 600px) {
          .themes-form, .themes-table, .themes-day {
            padding: 0.8rem 0.2rem;
          }
          .themes-table-cell, .themes-day-label {
            font-size: 0.98rem;
          }
          .themes-table {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
