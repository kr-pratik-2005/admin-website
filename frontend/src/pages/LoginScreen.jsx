import React, { useState } from "react";
import bgImage from "../assets/loginbg.png";
import giraffeIcon from "../assets/Logo.png"; // Replace with your logo if needed
import { useNavigate } from "react-router-dom";
export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    // Navigate to /home after successful login
    navigate("/home");
  };

  return (
    <div
      className="login-bg"
      style={{
        backgroundImage: `url(${bgImage})`
      }}
    >
      <div className="login-center-box">
        <img src={giraffeIcon} alt="logo" className="login-logo" />
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div className="login-links-row">
            <a href="#" className="forgot-link">
              Forget Password ?
            </a>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">
            Login
          </button>
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
        </form>
      </div>
      <style>{`
        .login-bg {
          min-height: 100vh;
          width: 100vw;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .login-center-box {
          position: relative;
          z-index: 1;
          width: 350px;
          padding: 36px 28px 32px 28px;
          background: rgba(255, 255, 255, 0.93);
          border-radius: 20px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-logo {
          width: 54px;
          margin-bottom: 12px;
          display: block;
        }
        .login-title {
          font-size: 2rem;
          font-weight: bold;
          color: #444;
          margin-bottom: 24px;
        }
        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 18px;
          border: none;
          border-radius: 8px;
          background: #f7f7f7;
          font-size: 1rem;
          box-sizing: border-box;
          outline: none;
          transition: box-shadow 0.2s;
        }
        .login-input:focus {
          box-shadow: 0 0 0 2px #ffe066;
        }
        .login-links-row {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          margin-bottom: 18px;
        }
        .forgot-link {
          color: #6a7ee7;
          font-size: 0.96rem;
          text-decoration: none;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }
        .login-btn {
          width: 100%;
          padding: 12px 0;
          background: linear-gradient(90deg, #ffe066 0%, #ffd86b 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1.08rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 18px;
          transition: background 0.2s;
        }
        .login-btn:hover {
          background: linear-gradient(90deg, #ffd86b 0%, #ffe066 100%);
        }
        .remember-me {
          display: flex;
          align-items: center;
          font-size: 1rem;
          color: #555;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .login-error {
          color: #e06666;
          font-size: 0.98rem;
          margin-bottom: 12px;
          text-align: left;
          width: 100%;
        }
        @media (max-width: 480px) {
          .login-center-box {
            width: 95vw;
            padding: 18px 4vw 18px 4vw;
          }
        }
      `}</style>
    </div>
  );
}
