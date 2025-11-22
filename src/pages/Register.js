import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";
import logo from "../assests/logo.png";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, phone } = form;
    if (name.length < 3) return alert("Name must be at least 3 characters");
    if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Invalid email format");
    if (!/^[0-9]{10}$/.test(phone)) return alert("Enter a valid 10-digit phone number");
    if (password.length < 6) return alert("Password must be at least 6 characters");

    try {
      const res = await axios.post("http://localhost:5000/user/register", form);
      alert(res.data.msg);

      if (res.data.success) {
        setVerifyEmail(form.email);
        setForm({ name: "", email: "", password: "", phone: "" });
        setOtpStep(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/verify-otp", {
        email: verifyEmail,
        otp,
      });
      alert(res.data.msg);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert(err.response?.data?.msg || "OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="register-container">

      {/* LEFT ORANGE PANEL */}
      <div className="left-panel">
        <h1>Simplify Your Sharing<br></br> with TinyLinks</h1>

        <p>
          Manage links easily with TinyLinks—your smart and lightweight URL solution.
          Shorten, organize, and share links effortlessly.
          Designed for speed, simplicity, and seamless user experience.
        </p>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="right-panel">
        <div className="form-box text-center">
          <img
           src={logo}
            alt="TinyLinks"
            className="right-side-image"
          />
         {/*  <h2>{otpStep ? "OTP Verification" : "Welcome"}</h2> */}
         <p className="subtitle">{otpStep ? "Verify your email" : "Create your account"}</p>

          {!otpStep ? (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <button className="primary-btn">Register</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <p className="otp-text">
                Enter OTP sent to <strong>{verifyEmail}</strong>
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="primary-btn">Verify OTP</button>
            </form>
          )}

          {!otpStep && (
            <p className="login-text">
              Already have an account?{" "}
              <Link to="/">Login</Link>
            </p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Register;