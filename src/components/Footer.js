import React from "react";

function Footer() {
  return (
    <footer
      style={{
        background: "#f0471cff",
        padding: "20px",
        textAlign: "center",
        marginTop: "30px",
        color: "white",
        fontSize: "14px"
      }}
    >
      <p>© {new Date().getFullYear()} TinyLink. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
