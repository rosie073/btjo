import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDXmcoM0Sk3lJInvJi2mGWeXTkkOiA00ZU",
  authDomain: "siaa-ff9f4.firebaseapp.com",
  projectId: "siaa-ff9f4",
  storageBucket: "siaa-ff9f4.firebasestorage.app",
  messagingSenderId: "368180748618",
  appId: "1:368180748618:web:eb7a6283acbb749e54e1b3",
  measurementId: "G-3DD027B5P7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // "error" or "success"
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMsgType("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Login successful! Redirecting...");
      setMsgType("success");
      // You can redirect user here after login
    } catch (error) {
      console.error(error);
      let errorMessage = "Login failed. Please check your credentials.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Email or password is incorrect.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
      }
      setMessage(errorMessage);
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.logo}>C</div>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.msg,
              backgroundColor: msgType === "error" ? "#ffebee" : "#e8f5e9",
              color: msgType === "error" ? "#c62828" : "#2e7d32",
              border:
                msgType === "error"
                  ? "1px solid #ffcdd2"
                  : "1px solid #c8e6c9",
            }}
          >
            {message}
          </p>
        )}

        <p style={styles.smallText}>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
        <p style={styles.smallText}>
          Forgot password? <a href="/forgot-password">Reset here</a>
        </p>
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  body: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #6c3bff 0%, #8a63ff 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  card: {
    background: "white",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  logo: {
    width: "70px",
    height: "70px",
    background: "linear-gradient(135deg, #6c3bff 0%, #8a63ff 100%)",
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  msg: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
  },
  smallText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
};
