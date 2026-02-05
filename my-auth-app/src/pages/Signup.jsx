import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

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
const db = getFirestore(app);

export default function SignUp() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState(""); // "error" or "success"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMsgType("");

    // Validations
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setMsgType("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Password should be at least 6 characters.");
      setMsgType("error");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Send verification email
      await sendEmailVerification(cred.user);

      // Save extra info in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        fullname,
        username,
        email,
        createdAt: serverTimestamp(),
      });

      setMessage(
        "Account created successfully! Please check your email to verify your account."
      );
      setMsgType("success");

      // reset form
      setFullname("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setMessage(err.message);
      setMsgType("error");
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.logo}>C</div>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose username"
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label>Email Address</label>
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
              placeholder="Create password"
              required
            />
            <div style={styles.passwordReq}>
              Use 8+ characters with a mix of letters, numbers & symbols
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div style={styles.row}>
            <div style={styles.remember}>
              <input type="checkbox" id="suRemember" />
              <label htmlFor="suRemember">Remember me</label>
            </div>
          </div>

          <button type="submit">Create Account</button>
        </form>

        {message && (
          <p
            style={{
              ...styles.msg,
              backgroundColor: msgType === "error" ? "#ffebee" : "#e8f5e9",
              color: msgType === "error" ? "#c62828" : "#2e7d32",
              border: msgType === "error" ? "1px solid #ffcdd2" : "1px solid #c8e6c9",
            }}
          >
            {message}
          </p>
        )}

        <div style={styles.divider}>
          <span>Already have an account?</span>
        </div>

        <p style={styles.smallText}>
          Already have an account? <a href="/login">Sign in here</a>
        </p>
      </div>
    </div>
  );
}

// Inline styles (converted from your CSS)
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
  inputGroup: {
    marginBottom: "18px",
    textAlign: "left",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  passwordReq: {
    fontSize: "12px",
    color: "#666",
    marginTop: "5px",
    textAlign: "left",
  },
  row: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
    fontSize: "14px",
  },
  remember: {
    display: "flex",
    alignItems: "center",
  },
  msg: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "25px 0",
    color: "#888",
    justifyContent: "center",
  },
  smallText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
};
