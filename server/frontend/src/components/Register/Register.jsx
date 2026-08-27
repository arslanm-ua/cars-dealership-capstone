import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userName || !firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("/djangoapp/register", {
        userName,
        firstName,
        lastName,
        email,
        password,
      });

      const data = res.data;

      if (data && data.status === "Authenticated") {
        localStorage.setItem("username", data.userName || userName);
        navigate("/");
        return;
      }

      if (data && data.status === "Failed") {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      if (data && data.error) {
        setError(data.error);
        return;
      }

      setError("Registration failed. Please try again.");
    } catch (err) {
      const serverMessage =
        err.response && err.response.data
          ? err.response.data.message || err.response.data.error
          : null;
      setError(serverMessage || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2>Sign Up</h2>

        {error && <div className="register-error">{error}</div>}

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
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" className="register-button">
          Register
        </button>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
