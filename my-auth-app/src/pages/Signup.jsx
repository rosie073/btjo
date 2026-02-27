import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../ui/AuthShell.jsx";
import TextField from "../ui/TextField.jsx";
import logo from "../assets/logo.jpg";

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

    // Just let browser validate automatically
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    console.log("signup", form);
  }

  return (
    <AuthShell
      variant="split"
      logoSrc={logo}
      leftTitle="Welcome!"
      leftSubtitle="Documents Tracking System"
      leftDesc="Monitor document status, improve workflow efficiency, and ensure proper handling of office records."
    >
      <div className="card cardWide">
        <h3 className="cardTitle">SIGN UP</h3>

        {/* IMPORTANT: no noValidate here */}
        <form onSubmit={onSubmit} className="form">
          <TextField
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={(v) => set("firstName", v)}
            required
          />

          <TextField
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(v) => set("lastName", v)}
            required
          />

          <TextField
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(v) => set("email", v)}
            required
          />

          <TextField
            name="number"
            type="tel"
            placeholder="Number"
            value={form.number}
            onChange={(v) => set("number", v)}
            required
          />

          <TextField
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(v) => set("password", v)}
            required
            minLength={8}
          />

          <TextField
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(v) => set("confirm", v)}
            required
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
        </form>


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










      </div>
    </AuthShell>
  );
}