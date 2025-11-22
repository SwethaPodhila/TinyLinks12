import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"; // Add CSS file

const API = process.env.REACT_APP_API || "http://localhost:5000";
const BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;

function Dashboard() {
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState("");
  const [code, setCode] = useState("");
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // Fetch all links
  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API}/api/links`);
      setLinks(res.data);
      setFilteredLinks(res.data);
    } catch (error) {
      console.error("Failed to load links");
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Filter + Search + Sort
  useEffect(() => {
    let data = [...links];

    // Search filter
    // Search filter (longUrl + code + short URL)
    if (search.trim() !== "") {
      data = data.filter((item) =>
        item.longUrl.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        `${BASE_URL}/${item.code}`.toLowerCase().includes(search.toLowerCase())
      );
    }


    // Sort filter
    if (sort === "latest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "clicks-high") {
      data.sort((a, b) => b.clicks - a.clicks);
    } else if (sort === "clicks-low") {
      data.sort((a, b) => a.clicks - b.clicks);
    }

    setFilteredLinks(data);
  }, [search, sort, links]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ⭐ Custom Code Validation — Exactly 6 chars
    if (code.trim() !== "" && code.trim().length !== 6) {
      setLoading(false);
      return alert("Custom code must be exactly 6 characters.");
    }

    try {
      await axios.post(`${API}/api/links`, {
        longUrl,
        code: code.trim() === "" ? undefined : code,
      });

      setLongUrl("");
      setCode("");
      fetchLinks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create link");
    }

    setLoading(false);
  };

  // Delete link with confirmation
  const deleteLink = async (delCode) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    await axios.delete(`${API}/api/links/${delCode}`);
    fetchLinks();
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="title">TinyLink Dashboard</h2>

        {/* Input Form */}
        <div className="card">
          <h3>Create Short Link</h3>
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Enter long URL..."
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
              className="input"
            />

            <input
              type="text"
              placeholder="Custom Code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input"
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>

        {/* Filters Section */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search URL..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="sort-dropdown"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="clicks-high">Clicks High → Low</option>
            <option value="clicks-low">Clicks Low → High</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>URL</th>
                <th>Clicks</th>
                <th>Last Clicked</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link.code}>
                  <td>{link.code}</td>

                  <td>
                    <a
                      href={`${API}/${link.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {BASE_URL}/{link.code}
                    </a>
                  </td>

                  {/* UPDATED CLICKS */}
                  <td>{link.clicks}</td>

                  {/* UPDATED LAST CLICKED */}
                  <td>
                    {link.lastClicked
                      ? new Date(link.lastClicked).toLocaleString()
                      : "Never"}
                  </td>

                  <td>

                    <button
                      className="btn-danger"
                      onClick={() => deleteLink(link.code)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn-info"
                      onClick={() => navigate(`/code/${link.code}`)}
                    >
                      Stats
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
