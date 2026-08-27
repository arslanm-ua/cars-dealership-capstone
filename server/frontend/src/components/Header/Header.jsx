import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [location]);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" ? "active" : "";
    }
    return location.pathname.startsWith(path) ? "active" : "";
  };

  const handleLogout = async () => {
    try {
      await axios.get("/djangoapp/logout");
    } catch (err) {
      // even if the request fails, clear local session state
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem("username");
      setUsername(null);
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          Best Cars Dealership
        </Link>
        <nav className="nav-links">
          <Link to="/" className={`nav-item ${isActive("/")}`}>
            Home
          </Link>
          <a href="/static/About.html" className="nav-item">
            About Us
          </a>
          <a href="/static/Contact.html" className="nav-item">
            Contact Us
          </a>
        </nav>
        <div className="auth-links">
          {username ? (
            <>
              <span className="welcome-text">Welcome, {username}</span>
              <button className="link-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-item ${isActive("/login")}`}>
                Login
              </Link>
              <Link
                to="/register"
                className={`nav-item ${isActive("/register")}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
