import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../ui/AuthShell.jsx";
import TextField from "../ui/TextField.jsx";
<img src="/logo.jpg" />

export default function ForgotReset() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");

  function onForgot(e) {
    e.preventDefault();
    console.log("forgot", { email });
  }

  function onReset(e) {
    e.preventDefault();
    if (pw.length < 6) return alert("Password must be at least 6 characters.");
    if (pw !== confirm) return alert("Passwords do not match.");
    console.log("reset", { pw });
  }

  return (
    <AuthShell
      variant="center"
      // logoSrc={logo}
    >
      <div className="cardsRow">
        <div className="card cardSmall">
          <h3 className="cardTitle">Forgot Password</h3>

          <form onSubmit={onForgot} className="form">
            <TextField
              label="Email"
              required
              placeholder="Enter your Email"
              value={email}
              onChange={setEmail}
            />
            <button className="btn" type="submit">
              Forgot Password
            </button>

            <div className="mutedCenter" style={{ marginTop: 10 }}>
              <Link className="link" to="/login">
                Back to Log In
              </Link>
            </div>
          </form>
        </div>

        <div className="card cardSmall">
          <h3 className="cardTitle">Reset Password</h3>

          <form onSubmit={onReset} className="form">
            <TextField
              label="Password"
              required
              type="password"
              placeholder="Enter your Password"
              value={pw}
              onChange={setPw}
            />
            <TextField
              label="Confirm Password"
              required
              type="password"
              placeholder="Confirm your Password"
              value={confirm}
              onChange={setConfirm}
            />
            <button className="btn" type="submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}