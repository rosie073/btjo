import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState({ type: "info", text: "" });

  const emailFromState = location.state?.email || "";

  useEffect(() => {
    const u = auth.currentUser;
    if (u?.emailVerified) navigate("/login");
    if (emailFromState) {
      setMsg({
        type: "info",
        text: `We sent a verification link to ${emailFromState}. Please check your inbox (and spam folder).`,
      });
    } else {
      setMsg({
        type: "info",
        text: "We sent a verification link to your email. Please check your inbox (and spam folder).",
      });
    }
  }, [navigate, emailFromState]);

  async function resend() {
    setMsg({ type: "info", text: "" });
    setSent(false);

    try {
      const u = auth.currentUser;
      if (!u) {
        setMsg({
          type: "error",
          text: "No active session found. Please log in again, then resend verification.",
        });
        return;
      }
      await sendEmailVerification(u);
      setSent(true);
      setMsg({ type: "success", text: "Verification email sent again." });
    } catch (e) {
      setMsg({ type: "error", text: e?.message || "Failed to send verification email." });
    }
  }

  async function checkVerified() {
    setMsg({ type: "info", text: "" });

    try {
      const u = auth.currentUser;
      if (!u) {
        setMsg({
          type: "error",
          text: "No active session found. Please log in again after verifying.",
        });
        return;
      }

      await u.reload();

      if (u.emailVerified) {
        // ✅ verified -> go login
        navigate("/login");
      } else {
        setMsg({
          type: "info",
          text: "Not verified yet. Please click the verification link in your email, then try again.",
        });
      }
    } catch (e) {
      setMsg({ type: "error", text: e?.message || "Failed to refresh user." });
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h2>Verify your email</h2>

      {msg.text && (
        <div className={`notice ${msg.type}`} style={{ marginTop: 12 }}>
          {msg.text}
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <button onClick={checkVerified} style={{ marginRight: 10 }}>
          I already verified
        </button>
        <button onClick={resend}>Resend verification email</button>
      </div>

      {sent && <p style={{ marginTop: 12 }}>Verification email sent!</p>}

      <p style={{ marginTop: 18 }}>
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
}