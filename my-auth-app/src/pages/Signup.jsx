import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../ui/AuthShell.jsx";
import TextField from "../ui/TextField.jsx";
import logo from "../assets/logo.jpg";

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    password: "",
    confirm: "",
  });

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  // ✅ If we used redirect login, this will catch the result after redirect back
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (!result?.user) return;

        const user = result.user;
        console.log("Google Redirect User:", user);

        setForm((p) => ({
          ...p,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
        }));

        // OPTIONAL redirect
        // navigate("/dashboard");
      })
      .catch((error) => {
        // If there's no redirect result, Firebase may throw "auth/no-auth-event" sometimes.
        // We can ignore those, but show real errors.
        if (
          error?.code &&
          !["auth/no-auth-event", "auth/cancelled-popup-request"].includes(
            error.code
          )
        ) {
          console.error("Redirect Result Error:", error);
        }
      });
  }, [navigate]);

  function onSubmit(e) {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Manual signup:", form);
    // TODO: connect to backend
  }

  // ✅ GOOGLE SIGNUP: try popup; if blocked/fails, fallback to redirect
  async function handleGoogleSignup() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google Popup User:", {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });

      setForm((p) => ({
        ...p,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
      }));

      // OPTIONAL redirect
      // navigate("/dashboard");
    } catch (error) {
      console.error("Popup failed, trying redirect:", error);

      // If popup failed (popup blocked / network issue), use redirect login
      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (err2) {
        console.error("Redirect also failed:", err2);
        alert(err2?.message || "Google sign-in failed.");
      }
    }
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

        <form onSubmit={onSubmit} className="form">
          <TextField
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={(v) => setField("firstName", v)}
            required
          />

          <TextField
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(v) => setField("lastName", v)}
            required
          />

          <TextField
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(v) => setField("email", v)}
            required
          />

          <TextField
            name="number"
            type="tel"
            placeholder="Number"
            value={form.number}
            onChange={(v) => setField("number", v)}
            required
          />

          <TextField
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(v) => setField("password", v)}
            required
            minLength={8}
          />

          <TextField
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(v) => setField("confirm", v)}
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

        <div className="googleWrapper">
          <button
            type="button"
            className="btnOutline googleBtn"
            onClick={handleGoogleSignup}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="googleIcon"
            />
            <span>Sign up with Google</span>
          </button>
        </div>
      </div>
    </AuthShell>
  );
}