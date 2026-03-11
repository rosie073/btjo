import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Trackingmain.css";
import logo from "../assets/logo.jpg";
import ProfileMenu from "../components/ProfileMenu";

import {
  Bell,
  X,
  Menu,
  Files,
  MapPinned,
  Building2,
  BarChart3,
  Settings,
  CircleHelp,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const documents = [
  {
    docId: "DOC-1001",
    id: "Doc - 1001",
    title: "Building Permit Request",
    origin: "Market",
    current: "Mayor",
    status: "Decline",
    officer: "J. Silvalism",
    received: "01/15/2026",
    update: "02/15/2026",
    days: 5,
    due: "05/15/2026",
  },
  {
    docId: "DOC-1002",
    id: "Doc - 1002",
    title: "Approval Document",
    origin: "Mayor",
    current: "Mayor",
    status: "Return",
    officer: "D. Coley",
    received: "01/15/2026",
    update: "02/15/2026",
    days: 5,
    due: "05/15/2026",
  },
  {
    docId: "DOC-1003",
    id: "Doc - 1003",
    title: "SALN",
    origin: "SB",
    current: "Mayor",
    status: "Pending",
    officer: "K. Pance",
    received: "01/15/2026",
    update: "02/15/2026",
    days: 5,
    due: "05/15/2026",
  },
];

export default function Trackingmain() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  function onSignOut() {
    alert("Sign out clicked.");
  }

  return (
    <div className="tracking-page">
      <header className="topbar">
        <div className="topbar-left">
          <img src={logo} alt="Municipal Logo" className="topbar-logo" />
          <span className="topbar-title">Municipal Documents Dashboard</span>
        </div>

        <div className="topbar-right">
          <button className="icon-btn" aria-label="Notifications" type="button">
            <Bell size={18} strokeWidth={2.2} />
          </button>

          <ProfileMenu />

          <button className="icon-btn" aria-label="Close" type="button">
            <X size={18} strokeWidth={2.2} />
          </button>

          <button
            className="icon-btn"
            aria-label="Open menu"
            type="button"
            onClick={() => setNavOpen((v) => !v)}
          >
            <Menu size={18} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      <section className="content-head">
        <div className="content-head-inner">
          <h2>Tracking Documents</h2>

          <div className="search-box">
            <input type="text" placeholder="Search Document ID..." />
            <span className="search-icon">⌕</span>
          </div>
        </div>
      </section>

      <main className="tracking-wrapper">
        <div className="table-frame">
          <table className="tracking-table">
            <thead>
              <tr>
                <th>Doc ID</th>
                <th>Document Title</th>
                <th>Origin Department</th>
                <th>Current Department</th>
                <th>Current Status</th>
                <th>Assign To</th>
                <th>Received Date</th>
                <th>Last Update</th>
                <th>Days In Dept.</th>
                <th>Due Date</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc, index) => (
                <tr
                  key={`${doc.docId}-${index}`}
                  onClick={() => navigate(`/tracking/${doc.docId}`)}
                >
                  <td>{doc.id}</td>
                  <td>{doc.title}</td>
                  <td>{doc.origin}</td>
                  <td>{doc.current}</td>
                  <td>
                    <span className={`status-badge ${doc.status.toLowerCase()}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>{doc.officer}</td>
                  <td>{doc.received}</td>
                  <td>{doc.update}</td>
                  <td>{doc.days}</td>
                  <td>{doc.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {navOpen && (
        <div className="nav-overlay" onClick={() => setNavOpen(false)}>
          <aside className="right-nav" onClick={(e) => e.stopPropagation()}>
            <button className="nav-close" onClick={() => setNavOpen(false)}>
              <X size={18} strokeWidth={2.2} />
            </button>

            <nav className="nav-list">
              <button
                className="nav-item"
                onClick={() => {
                  navigate("/dashboard");
                  setNavOpen(false);
                }}
              >
                <span className="nav-ico">
                  <LayoutDashboard size={16} strokeWidth={2.2} />
                </span>
                Dashboard
              </button>

              <button
                className="nav-item"
                onClick={() => {
                  navigate("/documents");
                  setNavOpen(false);
                }}
              >
                <span className="nav-ico">
                  <Files size={16} strokeWidth={2.2} />
                </span>
                Documents
              </button>

              <button
                className="nav-item active"
                onClick={() => {
                  navigate("/tracking");
                  setNavOpen(false);
                }}
              >
                <span className="nav-ico">
                  <MapPinned size={16} strokeWidth={2.2} />
                </span>
                Tracking
              </button>

              <button className="nav-item">
                <span className="nav-ico">
                  <Bell size={16} strokeWidth={2.2} />
                </span>
                Notification
              </button>

              <button className="nav-item">
                <span className="nav-ico">
                  <Building2 size={16} strokeWidth={2.2} />
                </span>
                Departments
              </button>

              <button className="nav-item">
                <span className="nav-ico">
                  <BarChart3 size={16} strokeWidth={2.2} />
                </span>
                Reports &amp; Analytics
              </button>

              <button className="nav-item">
                <span className="nav-ico">
                  <Settings size={16} strokeWidth={2.2} />
                </span>
                Settings
              </button>

              <button className="nav-item">
                <span className="nav-ico">
                  <CircleHelp size={16} strokeWidth={2.2} />
                </span>
                Help
              </button>
            </nav>

            <div className="nav-footer">
              <button className="nav-signout" onClick={onSignOut}>
                <LogOut size={16} strokeWidth={2.2} />
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}