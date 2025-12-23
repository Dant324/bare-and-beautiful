import React, { useState } from "react";
import { db } from "./firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Please fill in both fields");

    try {
      const q = query(
        collection(db, "Admins"),
        where("email", "==", email),
        where("password", "==", password)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) onLoginSuccess();
      else setError("Invalid admin credentials");
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to bottom, #ffeef0, #fff5f0)"
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          width: "360px",
          textAlign: "center"
        }}
      >
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1rem", color: "#f472b6" }}>
          Admin Login
        </h2>
        {error && <p style={{ color: "#ef4444", marginBottom: "0.5rem" }}>{error}</p>}
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
            border: "1px solid #e5e7eb"
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
            border: "1px solid #e5e7eb"
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
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
