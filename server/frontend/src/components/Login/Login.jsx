import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const res = await axios.post("/djangoapp/login", {
        userName,
        password,
      });

      const data = res.data;

      if (data && data.status === "Authenticated") {
        localStorage.setItem("username", data.userName || userName);
        navigate("/");
        return;
      }

      if (data && data.error) {
        setError(data.error);
        return;
      }

      setError("Invalid username or password.");
    } catch (err) {
      const serverMessage =
        err.response && err.response.data
          ? err.response.data.message || err.response.data.error
          : null;
      setError(serverMessage || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>

        <p className="login-footer">
          Don&apos;t have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
