import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../ui/AuthShell.jsx";
import TextField from "../ui/TextField.jsx";
import logo from "../assets/logo.jpg";

import { auth, googleProvider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function PasswordField({
  name,
  placeholder,
  value,
  onChange,
  show,
  onToggleShow,
  error,
  helper,
  autoComplete,
}) {
  return (
    <div className="field">
      <div className="pwWrap">
        <input
          className="input pwInput"
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          required
          minLength={8}
          autoComplete={autoComplete}
          aria-invalid={!!error}
        />

        <button
          type="button"
          className="pwToggle"
          onClick={onToggleShow}
          aria-label={show ? "Hide password" : "Show password"}
          title={show ? "Hide" : "Show"}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M10.6 10.6A3 3 0 0013.4 13.4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M9.9 5.2A10.7 10.7 0 0112 5c6.5 0 10 7 10 7a18.6 18.6 0 01-4.2 5.1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6.3 6.3C3.7 8.2 2 12 2 12s3.5 7 10 7c1 0 2-.2 2.9-.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {(error || helper) && (
        <div className={`helpText ${error ? "helpError" : ""}`}>{error || helper}</div>
      )}
    </div>
  );
}

function getPasswordRules(pw) {
  return [
    { key: "len", label: "At least 8 characters", ok: (pw?.length ?? 0) >= 8 },
    { key: "num", label: "At least 1 number", ok: /\d/.test(pw || "") },
    { key: "low", label: "At least 1 lowercase letter", ok: /[a-z]/.test(pw || "") },
    { key: "up", label: "At least 1 uppercase letter", ok: /[A-Z]/.test(pw || "") },
    { key: "sym", label: "At least 1 special character", ok: /[^A-Za-z0-9]/.test(pw || "") },
  ];
}

function getStrengthFromRules(rules) {
  const passed = rules.filter((r) => r.ok).length;
  const percent = Math.round((passed / rules.length) * 100);

  const label =
    passed <= 1 ? "Weak password" :
    passed <= 3 ? "Medium password" :
    passed === 4 ? "Good password" :
    "Strong password";

  const tone =
    passed <= 1 ? "weak" :
    passed <= 3 ? "medium" :
    passed === 4 ? "good" :
    "strong";

  return { passed, percent, label, tone };
}

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

  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);

  const [notice, setNotice] = useState({
    type: "",
    message: "",
  });

  function showNotice(type, message) {
    setNotice({ type, message });
  }

  function clearNotice() {
    setNotice({ type: "", message: "" });
  }

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
    if (notice.message) clearNotice();
  }

  const rules = useMemo(() => getPasswordRules(form.password), [form.password]);
  const strength = useMemo(() => getStrengthFromRules(rules), [rules]);

  const confirmLiveError = useMemo(() => {
    if (!form.confirm) return "";
    if (form.password === form.confirm) return "";
    return "Passwords do not match.";
  }, [form.password, form.confirm]);

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user) return;
        const user = result.user;

        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
            email: user.email || "",
            number: "",
            provider: "google",
            photoURL: user.photoURL || "",
            emailVerified: user.emailVerified,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        setForm((p) => ({
          ...p,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
        }));

        if (user.emailVerified) {
          navigate("/dashboard");
        } else {
          showNotice(
            "info",
            "Your Google account is not yet verified. Please verify it first before continuing."
          );
        }
      })
      .catch((error) => {
        if (
          error?.code &&
          !["auth/no-auth-event", "auth/cancelled-popup-request"].includes(error.code)
        ) {
          console.error("Redirect Result Error:", error);
          showNotice("error", "Google sign-in could not be completed.");
        }
      });
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    clearNotice();

    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    if (!passwordRegex.test(form.password)) {
      showNotice("error", "Password must meet all the required rules.");
      return;
    }

    if (form.password !== form.confirm) {
      showNotice("error", "Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        number: form.number,
        provider: "password",
        photoURL: "",
        emailVerified: cred.user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await sendEmailVerification(cred.user);
      await signOut(auth);

      setVerifyModal(true);
    } catch (err) {
      console.error("Signup error:", err);

      let message = "Signup failed. Please try again.";

      if (err?.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (err?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err?.code === "auth/weak-password") {
        message = "Your password is too weak.";
      }

      showNotice("error", message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignup() {
    clearNotice();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
          number: form.number || "",
          provider: "google",
          photoURL: user.photoURL || "",
          emailVerified: user.emailVerified,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setForm((p) => ({
        ...p,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
      }));

      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        showNotice("info", "Please verify your Google email first before continuing.");
      }
    } catch (error) {
      console.error("Popup failed, trying redirect:", error);

      try {
        await signInWithRedirect(auth, googleProvider);
      } catch (err2) {
        console.error("Redirect also failed:", err2);
        showNotice("error", "Google sign-in failed. Please try again.");
      }
    }
  }

  return (
    <>
      <AuthShell
        variant="split"
        logoSrc={logo}
        leftTitle="Welcome!"
        leftSubtitle="Documents Tracking System"
        leftDesc="Monitor document status, improve workflow efficiency, and ensure proper handling of office records."
      >
        <div className="card cardWide">
          <h3 className="cardTitle">SIGN UP</h3>

          <div className="cardBodyScroll">
            {notice.message && (
              <div className={`notice ${notice.type}`}>
                <div className="noticeContent">
                  <span className="noticeText">{notice.message}</span>
                  <button
                    type="button"
                    className="noticeClose"
                    onClick={clearNotice}
                    aria-label="Close message"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

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

              <PasswordField
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={(v) => setField("password", v)}
                show={showPw}
                onToggleShow={() => setShowPw((s) => !s)}
                autoComplete="new-password"
              />

              <div className="pwMeter">
                <div className="pwBar">
                  <div
                    className={`pwFill ${strength.tone}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>

                {form.password ? (
                  <>
                    <div className="pwStatus">
                      <strong>{strength.label}.</strong> <span>Must contain:</span>
                    </div>

                    <ul className="pwRules">
                      {rules.map((r) => (
                        <li key={r.key} className={r.ok ? "ok" : "bad"}>
                          <span className="pwIcon">{r.ok ? "✓" : "✕"}</span>
                          <span>{r.label}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="pwStatus muted">Start typing a password…</div>
                )}
              </div>

              <PasswordField
                name="confirm"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={(v) => setField("confirm", v)}
                show={showConfirm}
                onToggleShow={() => setShowConfirm((s) => !s)}
                autoComplete="new-password"
                error={confirmLiveError}
              />

              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "Creating account..." : "Sign Up"}
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
        </div>
      </AuthShell>

      {verifyModal && (
        <div className="modalOverlay">
          <div className="modalCard">
            <div className="modalIconWrap">
              <div className="modalIcon">✉</div>
            </div>

            <h3 className="modalTitle">Verify Your Email</h3>

            <p className="modalText">
              A verification email has been sent to <strong>{form.email}</strong>.
            </p>

            <p className="modalText">
              Please check your <strong>Inbox</strong> or <strong>Spam</strong> folder and
              click the verification link before logging in.
            </p>

            <div className="modalActions">
              <button
                className="btn"
                onClick={() => {
                  setVerifyModal(false);
                  navigate("/login");
                }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}