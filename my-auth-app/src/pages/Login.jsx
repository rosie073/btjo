import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../ui/AuthShell.jsx";
import TextField from "../ui/TextField.jsx";
// import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // TODO: hook to backend
    console.log("login", { email, pw });
  }

  return (
    <AuthShell
      variant="split"
      // logoSrc={logo}
      leftTitle="Welcome!"
      leftSubtitle="Documents Tracking System"
      leftDesc={
        "Monitor document status, improve workflow efficiency,\nand ensure proper handling of office records."
      }
    >
      <div className="card cardWide">
        <h3 className="cardTitle">LOG IN</h3>

        <form onSubmit={onSubmit} className="form">
          <TextField
            label="Email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
          />

          <TextField
            label="Password"
            required
            type="password"
            placeholder="Enter your password"
            value={pw}
            onChange={setPw}
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