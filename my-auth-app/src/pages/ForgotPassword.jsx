import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // "success" or "error"
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMsgType("");

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setMsgType("error");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "✅ Password reset email sent! Please check your inbox and spam folder."
      );
      setMsgType("success");
      setEmail("");
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      let type = "error";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/user-not-found":
          errorMessage =
            "If an account with this email exists, a reset link has been sent.";
          type = "success";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Check your connection.";
          break;
      }

      setMessage(errorMessage);
      setMsgType(type);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.logo}>C</div>
        <h2>Reset Your Password</h2>
        <p style={styles.description}>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending Reset Link..." : "Send Reset Link"}
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
          Remember your password? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
}

// Inline styles (copied from your CSS)
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
    maxWidth: "450px",
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
  description: {
    color: "#666",
    marginBottom: "30px",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  inputGroup: {
    marginBottom: "25px",
    textAlign: "left",
  },
  msg: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "10px",
    fontSize: "14px",
    textAlign: "center",
    lineHeight: "1.5",
  },
  smallText: {
    marginTop: "25px",
    fontSize: "14px",
    color: "#666",
  },
};
