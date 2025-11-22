import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assests/logo.png";

function DashboardNavbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-2 fixed-top"
        style={{
          zIndex: 1030,
          borderBottom: "2px solid #e9ecef",
        }}
      >
        <div className="container-fluid">
          {/* Left: Logo */}
          <a className="navbar-brand fw-bold text-primary fs-2" href="/">
            <img
              src={logo}
              alt="TinyLinks"
              className="right-side-image"
            />
          </a>

          {/* Right: User Dropdown */}
          <div className="dropdown ms-auto position-relative">
            <button
              className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUserCircle size={22} />
              <span>{user ? user.name : "User"}</span>
            </button>

            {showDropdown && (
              <div
                className="dropdown-menu dropdown-menu-end show mt-2 shadow-sm rounded-3 p-2"
                style={{ right: 0, minWidth: "200px" }}
              >
                <div className="px-3 py-2 text-center border-bottom">
                  <strong>{user?.name}</strong>
                  <div className="text-muted small">{user?.email}</div>
                </div>
                <button
                  className="dropdown-item text-danger fw-semibold text-center mt-1"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <style>
          {`
  :root {
    --bs-primary: #ff6b00 !important;  /* 👈 your new primary color */
    --bs-primary-rgb: 255, 107, 0 !important;
  }
  body {
    padding-top: 70px; /* Adjust based on navbar height */
  } 
  .btn-outline-primary {
    border-color: var(--bs-primary) !important;
    color: var(--bs-primary) !important;
  }

  .btn-outline-primary:hover {
    background-color: var(--bs-primary) !important;
    color: #fff !important;
  }

  .text-primary {
    color: var(--bs-primary) !important;
  }
`}
        </style>
      </nav>
    </>
  );
}

export default DashboardNavbar;
