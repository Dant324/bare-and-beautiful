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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col justify-center items-center p-4 relative">
      {/* Back to Store Button */}
      <button 
        onClick={() => onNavigate('home')} 
       className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-pink-600 font-bold transition-colors cursor-pointer"
      >
        <ArrowLeft style={{ width: "1.25rem", height: "1.25rem" }} /> Back to Store
      </button>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="bg-card border border-border p-8 rounded-[2rem] shadow-sm w-full max-w-[360px] text-center transition-colors duration-500"
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
          className="w-full p-4 mb-4 rounded-xl border-none bg-muted text-foreground focus:ring-2 focus:ring-pink-500 outline-none transition-colors"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 mb-6 rounded-xl border-none bg-muted text-foreground focus:ring-2 focus:ring-pink-500 outline-none transition-colors"
        />
        
        <button
          type="submit"
          className="w-full p-4 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-colors shadow-md"
        >
        
          Login
        </button>
      </form>
    </div>
  );
}