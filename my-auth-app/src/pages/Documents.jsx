import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Documents.css";

import seal from "../assets/logo.jpg";

import {
  Bell,
  User,
  X,
  Menu,
  Search,
  ChevronDown,
  LayoutDashboard,
  Files,
  MapPinned,
  Building2,
  BarChart3,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

export default function Documents() {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Files");

  const documents = [
    {
      id: "Doc - 1001",
      title: "Building Permit Request",
      origin: "Market",
      current: "Mayor",
      status: "Decline",
      assign: "J. Silivalism",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1002",
      title: "Approval Document",
      origin: "Mayor",
      current: "Mayor",
      status: "Return",
      assign: "D. Coley",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1003",
      title: "SALN",
      origin: "SB",
      current: "Mayor",
      status: "Pending",
      assign: "K. Pance",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1004",
      title: "Support Request",
      origin: "Mayor",
      current: "Mayor",
      status: "Pending",
      assign: "S. Edwards",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1005",
      title: "Business Permit",
      origin: "Mayor",
      current: "Mayor",
      status: "Return",
      assign: "A. Mutter",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1006",
      title: "Paper",
      origin: "Planning",
      current: "Planning",
      status: "Completed",
      assign: "A. Mutter",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1007",
      title: "Paper",
      origin: "Planning",
      current: "Planning",
      status: "Incoming",
      assign: "A. Mutter",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1008",
      title: "Waterworks",
      origin: "Waterworks",
      current: "Waterworks",
      status: "Return",
      assign: "A. Mutter",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
  ];

  const tabs = [
    "All Files",
    "Pending",
    "Declined",
    "Returned",
    "Completed",
    "Incoming",
  ];

  const filteredDocuments = useMemo(() => {
    switch (activeTab) {
      case "Pending":
        return documents.filter((d) => d.status === "Pending");
      case "Declined":
        return documents.filter((d) => d.status === "Decline");
      case "Returned":
        return documents.filter((d) => d.status === "Return");
      case "Completed":
        return documents.filter((d) => d.status === "Completed");
      case "Incoming":
        return documents.filter((d) => d.status === "Incoming");
      default:
        return documents;
    }
  }, [activeTab]);

  const counts = {
    "All Files": documents.length,
    Pending: documents.filter((d) => d.status === "Pending").length,
    Declined: documents.filter((d) => d.status === "Decline").length,
    Returned: documents.filter((d) => d.status === "Return").length,
    Completed: documents.filter((d) => d.status === "Completed").length,
    Incoming: documents.filter((d) => d.status === "Incoming").length,
  };

  function onSignOut() {
    alert("Sign out clicked");
  }

  return (
    <div className="docs-page">
      <div className="docs-shell">
        <header className="docs-topbar">
          <div className="docs-topbar-left">
            <img className="docs-seal" src={seal} alt="Seal" />
            <div className="docs-topbar-title">Municipal Documents Dashboard</div>
          </div>

          <div className="docs-topbar-right">
            <button className="docs-icon-btn" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="docs-icon-btn" type="button" aria-label="User">
              <User size={18} />
            </button>
            <button className="docs-icon-btn" type="button" aria-label="Close">
              <X size={18} />
            </button>
            <button
              className="docs-icon-btn"
              type="button"
              aria-label="Menu"
              onClick={() => setNavOpen((v) => !v)}
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        <main className="docs-main">
          <div className="docs-header-row">
            <h2 className="docs-title">Documents</h2>

            <div className="docs-filters">
              <div className="docs-search-wrap">
                <input className="docs-search" placeholder="Search Document..." />
                <span className="docs-search-icon">
                  <Search size={14} />
                </span>
              </div>

              <div className="docs-select-wrap">
                <select className="docs-select">
                  <option>Filter : Department</option>
                </select>
                <ChevronDown size={14} className="docs-select-icon" />
              </div>

              <div className="docs-select-wrap small">
                <select className="docs-select">
                  <option>Status</option>
                </select>
                <ChevronDown size={14} className="docs-select-icon" />
              </div>

              <div className="docs-select-wrap small">
                <select className="docs-select">
                  <option>Date Range</option>
                </select>
                <ChevronDown size={14} className="docs-select-icon" />
              </div>

              <button className="docs-search-btn" type="button" aria-label="Search">
                <Search size={14} />
              </button>
            </div>
          </div>

          <div className="docs-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`docs-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>

          <div className="docs-table-wrap">
            <table className="docs-list-table">
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
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id + doc.title}>
                    <td>{doc.id}</td>
                    <td>{doc.title}</td>
                    <td>{doc.origin}</td>
                    <td>{doc.current}</td>
                    <td>
                      <span className={`docs-status ${doc.status.toLowerCase()}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>{doc.assign}</td>
                    <td>{doc.received}</td>
                    <td>{doc.updated}</td>
                    <td className="center">{doc.days}</td>
                    <td>{doc.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {navOpen && (
        <div className="docs-nav-overlay" onClick={() => setNavOpen(false)}>
          <aside className="docs-right-nav" onClick={(e) => e.stopPropagation()}>
            <nav className="docs-nav-list">
              <button className="docs-nav-item" onClick={() => navigate("/dashboard")}>
                <span className="docs-nav-ico">
                  <LayoutDashboard size={16} />
                </span>
                Dashboard
              </button>

              <button className="docs-nav-item active" onClick={() => navigate("/documents")}>
                <span className="docs-nav-ico">
                  <Files size={16} />
                </span>
                Documents
              </button>

              <button className="docs-nav-item">
                <span className="docs-nav-ico">
                  <MapPinned size={16} />
                </span>
                Tracking
              </button>

              <button className="docs-nav-item">
                <span className="docs-nav-ico">
                  <Bell size={16} />
                </span>
                Notification
              </button>

              <button className="docs-nav-item">
                <span className="docs-nav-ico">
                  <Building2 size={16} />
                </span>
                Departments
              </button>

              <button className="docs-nav-item">
                <span className="docs-nav-ico">
                  <BarChart3 size={16} />
                </span>
                Reports &amp; Analytics
              </button>

              <button className="docs-nav-item">
                <span className="docs-nav-ico">
                  <Settings size={16} />
                </span>
                Settings
              </button>

              <button className="docs-nav-item">
                <span className="docs-nav-ico">
                  <CircleHelp size={16} />
                </span>
                Help
              </button>
            </nav>

            <div className="docs-nav-footer">
              <button className="docs-nav-signout" onClick={onSignOut}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}