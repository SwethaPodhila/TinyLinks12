import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaLink, FaChartLine, FaClock, FaCalendar, FaCopy, FaArrowLeft } from "react-icons/fa";

const API = process.env.REACT_APP_API || "http://localhost:5000";

function StatsPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/links/${code}`).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [code]);

  if (loading) return <h2 style={styles.loading}>Loading...</h2>;
  if (!data) return <h2 style={styles.loading}>No data found</h2>;

  return (
    <>
      <Navbar />

      <div style={styles.outer}>
        <div style={styles.cardContainer}>
          <div style={styles.buttonRow}>


            <Link to="/" style={{ width: "48%" }}>
              <button style={styles.backButton}>
                <FaArrowLeft style={{ marginRight: 8 }} /> Back to Dashboard
              </button>
            </Link>

            <button
              style={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${data.code}`)}
            >
              <FaCopy style={{ marginRight: 8 }} />
              Copy Short Link
            </button>
          </div>
          {/* Header */}
          <div style={styles.cardHeader}>
            <FaChartLine style={styles.headerIcon} />
            <h2 style={styles.headerText}>Link Analytics</h2>
          </div>

          <p style={styles.subTitle}>
            Stats for <span style={{ color: "#FF6B35", fontWeight: 700 }}>{data.code}</span>
          </p>

          {/* TWO COLUMN STATS */}
          <div style={styles.statGrid}>
            <StatItem icon={<FaLink />} label="Original URL" value={data.longUrl} />
            <StatItem icon={<FaLink />} label="Short URL" value={`${window.location.origin}/${data.code}`} />
            <StatItem icon={<FaChartLine />} label="Total Clicks" value={data.clicks} />
            <StatItem icon={<FaCalendar />} label="Created On" value={new Date(data.createdAt).toLocaleString()} />
            <StatItem
              icon={<FaClock />}
              label="Last Clicked"
              value={data.lastClicked ? new Date(data.lastClicked).toLocaleString() : "Never"}
            />
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

const StatItem = ({ icon, label, value }) => (
  <div style={styles.statItem}>
    <span style={styles.statIcon}>{icon}</span>
    <div>
      <small style={styles.statLabel}>{label}</small>
      <p style={styles.statValue}>{value}</p>
    </div>
  </div>
);

export default StatsPage;

const styles = {
  loading: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 22,
  },

  outer: {
    padding: "50px 20px",
    background: "#F5F7FA",
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
  },

  cardContainer: {
    width: "100%",
    maxWidth: "900px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "35px",
    boxShadow: "0 6px 30px rgba(0,0,0,0.08)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },

  headerIcon: {
    color: "#FF6B35",
    fontSize: 30,
    marginRight: 12,
  },

  headerText: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
  },

  subTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
  },

  /* GRID LAYOUT */
  statGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: 30,
  },

  statItem: {
    display: "flex",
    alignItems: "flex-start",
    padding: "12px 10px",
    background: "#FAFAFA",
    borderRadius: "10px",
    borderLeft: "4px solid #FF6B35",
  },

  statIcon: {
    fontSize: 20,
    color: "#FF6B35",
    marginRight: 15,
    marginTop: 3,
  },

  statLabel: {
    color: "#777",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statValue: {
    margin: 0,
    fontSize: 16,
    color: "#222",
    fontWeight: 600,
    wordBreak: "break-all",
  },

  /* 2 BUTTONS SIDE BY SIDE */
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },

  copyButton: {
    background: "#FF6B35",
    color: "white",
    width: "25%",
    padding: "12px 10px",
    border: "none",
    borderRadius: "10px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },

  backButton: {
    background: "#000",
    color: "white",
    width: "50%",
    padding: "12px 12px",
    border: "none",
    borderRadius: "10px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop:-30,
  },
};
