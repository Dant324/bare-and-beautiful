import React, { useState } from "react";
import { auth } from "./firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ArrowLeft } from "lucide-react";

export default function AdminLogin({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // This triggers the onAuthStateChanged in App.jsx
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation happens automatically via App.jsx state
    } catch (err) {
      setError("Unauthorized or Invalid Credentials");
    }
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom, #ffeef0, #fff5f0)",
        position: "relative",
        padding: "1rem"
      }}
    >
      {/* Back to Store Button */}
      <button 
        onClick={() => onNavigate('home')} 
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          color: "#4b5563",
          fontWeight: "700",
          cursor: "pointer",
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#f472b6"}
        onMouseLeave={(e) => e.currentTarget.style.color = "#4b5563"}
      >
        <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} /> Back to Store
      </button>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "360px",
          textAlign: "center"
        }}
      >
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1rem", color: "#f472b6" }}>
          Admin Login
        </h2>
        
        {error && <p style={{ color: "#ef4444", marginBottom: "0.5rem", fontSize: "0.875rem" }}>{error}</p>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            boxSizing: "border-box"
          }}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            boxSizing: "border-box"
          }}
        />
        
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#f472b6",
            color: "white",
            fontWeight: "600",
            borderRadius: "0.5rem",
            cursor: "pointer",
            border: "none"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}