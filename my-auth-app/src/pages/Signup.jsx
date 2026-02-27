import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../ui/AuthShell.jsx";
import TextField from "../ui/TextField.jsx";
// import logo from "../assets/logo.png";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    password: "",
    confirm: "",
  });

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function onSubmit(e) {
    e.preventDefault();
    // TODO: hook to backend
    console.log("signup", form);
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
        <h3 className="cardTitle">SIGN UP</h3>

        <form onSubmit={onSubmit} className="form">
          <TextField
            label=""
            placeholder="First Name"
            value={form.firstName}
            onChange={(v) => set("firstName", v)}
          />
          <TextField
            label=""
            placeholder="Last Name"
            value={form.lastName}
            onChange={(v) => set("lastName", v)}
          />
          <TextField
            label=""
            placeholder="Email"
            value={form.email}
            onChange={(v) => set("email", v)}
          />
          <TextField
            label=""
            placeholder="Number"
            value={form.number}
            onChange={(v) => set("number", v)}
          />
          <TextField
            label=""
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(v) => set("password", v)}
          />
          <TextField
            label=""
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(v) => set("confirm", v)}
          />

          <button className="btn" type="submit">
            Sign Up
          </button>

          <div className="mutedCenter" style={{ marginTop: 10 }}>
            Already have an account?{" "}
            <Link className="link" to="/login">
              Log In
            </Link>
          </div>

          <div className="orRow">
            <span className="orLine" />
            <span className="orText">or</span>
            <span className="orLine" />
          </div>

          <button
            type="button"
            className="btnOutline googleBtn"
            onClick={() => console.log("google sign in")}
          >
            <span className="gIcon">G</span>
            Sign up with Google
          </button>
        </form>
      </div>
    </AuthShell>
  );
}