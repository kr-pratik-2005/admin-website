import React, { useState } from "react";
import giraffeIcon from "../assets/Logo.png"; // Update the path as needed
import { useNavigate,useLocation  } from 'react-router-dom';

export default function ChildReport(childData, setChildData, onNext) {
         const navigate = useNavigate();
         const location = useLocation();
   const isActive = (path) => {
  // Normalize both paths to avoid trailing slash issues
  const normalize = (p) => p.replace(/\/+$/, '');
  return normalize(location.pathname) === normalize(path);
};

     const handleDailyReportClick = () => {
    navigate('/daily-reports'); // Adjust route path as needed
  };
  
 
  const [form, setForm] = useState({
    name: "",
    dob: "",
    dobTime: "",
    bloodGroup: "",
    nickname: "",
    language: "",
  });

  const bloodGroups = [
    "A (+ve)", "A (-ve)",
    "B (+ve)", "B (-ve)",
    "AB (+ve)", "AB (-ve)",
    "O (+ve)", "O (-ve)"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Child data saved!");
  };

  return (
    <div className="child-bg">
      {/* Header */}
 <header className="child-header">
  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
    <img src={giraffeIcon} alt="logo" className="login-logo" />
    <nav style={{ display: 'flex', gap: '2rem' }}>
      <span
        style={{ color: '#6b7280', fontWeight: '500', cursor: 'pointer' }}
        onClick={() => navigate('/home')}
      >
        Home
      </span>
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
        style={{ color: '#8b5cf6', fontWeight: '500', cursor: 'pointer' }}
        
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
  <div className="header-right">
    <button className="add-btn">+ Add New Child</button>
  </div>
</header>



      {/* Main Content */}
      <main className="child-main">
        <h2 className="main-title">Child Data</h2>
        <div className="tab-bar">
      <button
        className={`tab${isActive('/child-report') ? ' tab-active' : ''}`}
        onClick={() => navigate('/child-report')}
      >
        Basic Information
      </button>
      <button
        className={`tab${isActive('/child-details') ? ' tab-active' : ''}`}
        onClick={() => navigate('/child-details')}
      >
        Emergency Details
      </button>
      <button
        className={`tab${isActive('/medical-info') ? ' tab-active' : ''}`}
        onClick={() => navigate('/medical-info')}
      >
        Medical Information
      </button>
      <button
        className={`tab${isActive('/development-info') ? ' tab-active' : ''}`}
        onClick={() => navigate('/development-info')}
      >
        Developmental Information
      </button>
      <button
        className={`tab${isActive('/daily-routine') ? ' tab-active' : ''}`}
        onClick={() => navigate('/daily-routine')}
      >
        Daily Routine
      </button>
      <button
        className={`tab${isActive('/additional-info') ? ' tab-active' : ''}`}
        onClick={() => navigate('/additional-info')}
      >
        Additional Information
      </button>
    </div>
        <form className="child-form" onSubmit={handleSubmit}>
          <div className="form-section">
      <div className="section-title">
        <span className="section-icon">1</span>
        Basic Information
      </div>
      <div className="form-group">
        <label>Name</label>
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Enter child's name"
          value={childData.name}
          onChange={e =>
            setChildData(prev => ({
              ...prev,
              name: e.target.value
            }))
          }
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>DOB</label>
          <div className="dob-row">
            <input
              className="input"
              type="date"
              name="dob"
              value={childData.dob}
              onChange={e =>
                setChildData(prev => ({
                  ...prev,
                  dob: e.target.value
                }))
              }
            />
          </div>
        </div>
        <div className="form-group">
          <label>Blood Group</label>
          <select
            className="input"
            name="blood_group"
            value={childData.blood_group}
            onChange={e =>
              setChildData(prev => ({
                ...prev,
                blood_group: e.target.value
              }))
            }
          >
            <option value="">Select</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Any nick name or preferred name</label>
        <input
          className="input"
          type="text"
          name="nick_name"
          placeholder="Enter nickname"
          value={childData.nick_name}
          onChange={e =>
            setChildData(prev => ({
              ...prev,
              nick_name: e.target.value
            }))
          }
        />
      </div>
      <div className="form-group">
        <label>Language spoken at home</label>
        <input
          className="input"
          type="text"
          name="language_spoken_at_home"
          placeholder="Enter language"
          value={childData.language_spoken_at_home}
          onChange={e =>
            setChildData(prev => ({
              ...prev,
              language_spoken_at_home: e.target.value
            }))
          }
        />
      </div>
      <div className="form-btn-row">
        <button
          type="button"
          className="next-btn"
          onClick={onNext} // Use the onNext prop to go to the next step
        >
          Next
        </button>
      </div>
    </div>
        </form>
      </main>
      {/* CSS */}
      <style>{`
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
        .header-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .child-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        .nav-link {
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
        .tab.active {
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
        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 20px;
        }
        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }
        .dob-row {
          display: flex;
          gap: 0.7rem;
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
        .form-btn-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 18px;
        }
        .next-btn {
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
        .next-btn:hover {
          background: #ffc700;
        }
        @media (max-width: 700px) {
          .child-header {
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
          .child-main {
            padding: 16px 2vw 16px 2vw;
          }
          .form-section {
            padding: 1.1rem 0.7rem;
          }
          .form-row {
            flex-direction: column;
            gap: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
