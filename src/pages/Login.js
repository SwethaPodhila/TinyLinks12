import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../assests/logo.png";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://tinylinks12.onrender.com/user/login",
        form
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="register-container">

      {/* LEFT ORANGE PANEL */}
      <div className="left-panel">
        <h1>Welcome Back<br />to TinyLinks</h1>
        <p>
          Easily manage, shorten and organize your links.
          Log in to access your dashboard and continue simplifying your sharing experience.
        </p>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="right-panel text-center">
        <div className="form-box">
          <img
            src={logo}
            alt="TinyLinks"
            className="right-side-image"
          />
          <p className="subtitle">Please Login</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="primary-btn">Login</button>
          </form>

          <p className="login-text">
            Don’t have an account?{" "}
            <Link to="/register" className="link-text">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
