import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../ui/AuthShell.jsx";
import TextField from "../ui/TextField.jsx";
import logo from "../assets/logo.jpg";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";





function PasswordFieldSimple({ placeholder, value, onChange, show, onToggleShow }) {
  return (
    <div className="field">
      <div className="pwWrap">
        <input
          className="input pwInput"
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button
          type="button"
          className="pwToggle"
          onClick={onToggleShow}
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide" : "Show"}
        >
          {show ? (
            // eye
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            // eye-off
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M10.6 10.6A3 3 0 0013.4 13.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9.9 5.2A10.7 10.7 0 0112 5c6.5 0 10 7 10 7a18.6 18.6 0 01-4.2 5.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M6.3 6.3C3.7 8.2 2 12 2 12s3.5 7 10 7c1 0 2-.2 2.9-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}








export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [showPw, setShowPw] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pw);

      if (!cred.user.emailVerified) {
        await signOut(auth);
        setMsg({
          type: "error",
          text: "Your email is not verified yet. Please check your email and click the verification link, then log in again.",
        });
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setMsg({ type: "error", text: err?.message || "Login failed." });
    }
  }

  return (
    <AuthShell
      variant="split"
      logoSrc={logo}
      leftTitle="Welcome!"
      leftSubtitle="Documents Tracking System"
      leftDesc={
        "Monitor document status, improve workflow efficiency,\nand ensure proper handling of office records."
      }
    >
      <div className="card cardWide">
        <h3 className="cardTitle">LOG IN</h3>

        {msg.text && <div className={`notice ${msg.type}`}>{msg.text}</div>}

        <form onSubmit={onSubmit} className="form">
          <TextField
            label="Email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
          />

          <PasswordFieldSimple
            placeholder="Enter your password"
            value={pw}
            onChange={setPw}
            show={showPw}
            onToggleShow={() => setShowPw((s) => !s)}
          />

          <div className="rowRight">
            <Link className="link" to="/forgot">
              Forgot Password?
            </Link>
          </div>

          <button className="btn" type="submit">
            Log In
          </button>

          <div className="divider" />

          <div className="mutedCenter">
            Don’t have account?{" "}
            <Link className="link" to="/signup">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}