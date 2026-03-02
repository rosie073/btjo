import React, { useState } from "react";
import "../ui/Dashboard.css";

// images (src/assets/)
import seal from "../assets/logo.jpg";
import bell from "../assets/image.png";
import userIcon from "../assets/user-3.png";
import closeIcon from "../assets/close.png";
import menuIcon from "../assets/menu.png";

function Dashboard() {
  const [showAddDocs, setShowAddDocs] = useState(false);

  const stats = [
    { label: "Total Documents", value: 211, className: "blue", icon: "📄" },
    { label: "In Progress", value: 56, className: "green", icon: "✳️" },
    { label: "Completed", value: 81, className: "mint", icon: "🧾" },
    { label: "Overdue", value: 25, className: "amber", icon: "🕒" },
    { label: "Urgent", value: 10, className: "red", icon: "🧯" },
    { label: "Alert", value: 4, className: "navy", icon: "⚠️" },
  ];

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
      status: "Pending",
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
      status: "Reviewing",
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
      status: "Reviewing",
      assign: "A. Mutter",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
  ];

  const deptCards = [
    {
      title: "Coast Guard",
      total: 7,
      items: [
        { label: "Pending", value: 4 },
        { label: "Overdue", value: 3 },
      ],
      tone: "green",
      icon: "⚙️",
    },
    {
      title: "Engineering",
      total: 6,
      items: [
        { label: "In Progress", value: 6 },
        { label: "Overdue", value: 2 },
      ],
      tone: "mint",
      icon: "🧩",
    },
    {
      title: "Mayor's Office",
      total: 5,
      items: [
        { label: "Reviewing", value: 3 },
        { label: "Completed", value: 2 },
      ],
      tone: "blue",
      icon: "🏛️",
    },
  ];

  const history = [
    { label: "Submitted by Applicant", date: "01/22/2026", type: "ok" },
    { label: "Sent to Tourism Dept.", date: "01/29/2026", type: "ok" },
    { label: "Reviewed by Engineering Dept.", date: "02/03/2026", type: "ok" },
    { label: "Returned for Revision", date: "02/10/2026", type: "bad" },
    { label: "Approved by Budget Office", date: "02/10/2026", type: "ok" },
  ];

  return (
    <div className="page">
      <div className="app-shell">
        {/* Header with images */}
        <header className="topbar">
          <div className="topbar-left">
            <img className="seal" src={seal} alt="Seal" />
            <div className="topbar-title">Municipal Documents Dashboard</div>
          </div>

          <div className="topbar-right">
            <button className="icon-btn" aria-label="Notifications">
              <img src={bell} alt="bell" />
            </button>
            <button className="icon-btn" aria-label="User">
              <img src={userIcon} alt="user" />
            </button>
            <button className="icon-btn" aria-label="Close">
              <img src={closeIcon} alt="close" />
            </button>
            <button className="icon-btn" aria-label="Menu">
              <img src={menuIcon} alt="menu" />
            </button>
          </div>
        </header>

        {/* Stats strip */}
        <section className="stats-strip">
          {stats.map((s) => (
            <div key={s.label} className={`stat-block ${s.className}`}>
              <div className="stat-left">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-label">{s.label}:</div>
              </div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </section>

        {/* Main card */}
        <main className="main-card">
          <div className="section-head">
            <h3 className="section-title">Document Tracking</h3>

            <div className="filters">
              <div className="search-wrap">
                <input className="search" placeholder="Search Document..." />
                <span className="search-icon">🔍</span>
              </div>

              <select className="select">
                <option>Filter : Department</option>
              </select>
              <select className="select">
                <option>Status</option>
              </select>
              <select className="select">
                <option>Date Range</option>
              </select>

              <button className="filter-btn" aria-label="Search">
                🔍
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="docs-table">
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
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.title}</td>
                    <td>{d.origin}</td>
                    <td>{d.current}</td>
                    <td>
                      <span className={`pill ${d.status.toLowerCase()}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>{d.assign}</td>
                    <td>{d.received}</td>
                    <td>{d.updated}</td>
                    <td className="center">{d.days}</td>
                    <td>{d.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom layout */}
          <section className="bottom-grid">
            {/* Left: Department Status */}
            <div className="card">
              <div className="card-title">Department Status</div>

              <div className="dept-grid">
                {deptCards.map((c) => (
                  <div key={c.title} className={`dept-card tone-${c.tone}`}>
                    <div className="dept-top">
                      <div className="dept-icon">{c.icon}</div>
                      <div className="dept-name">{c.title}</div>
                      <div className="dept-total">{c.total}</div>
                    </div>

                    <div className="dept-items">
                      {c.items.map((it) => (
                        <div key={it.label} className="dept-item">
                          <span className="dot" />
                          <span className="dept-item-label">{it.label}</span>
                          <span className="dept-item-val">{it.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mini-chart">
                <div className="mini-chart-title">Avg. Processing Time</div>
                <div className="mini-bars">
                  <div className="bar b1" />
                  <div className="bar b2" />
                  <div className="bar b3" />
                  <div className="bar b4" />
                  <div className="bar b5" />
                </div>
                <div className="mini-x">
                  <span>Planning</span>
                  <span>Engineering</span>
                  <span>Mayor</span>
                  <span>Finance</span>
                  <span>Admin</span>
                </div>
              </div>
            </div>

            {/* Middle: Document History */}
            <div className="card">
              <div className="card-title center-title">Document History</div>

              <div className="timeline">
                {history.map((h, idx) => (
                  <div key={idx} className="tl-row">
                    <div className="tl-left">
                      <span className={`tl-dot ${h.type}`} />
                      {idx !== history.length - 1 && <span className="tl-line" />}
                    </div>
                    <div className={`tl-text ${h.type === "bad" ? "bad" : ""}`}>
                      <span className="tl-label">{h.label}</span>
                      <span className="tl-date"> - {h.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Button */}
            <div className="button-col">
              <button className="add-docs" onClick={() => setShowAddDocs(true)}>
                ADD DOCUMENTS
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* ===== ONLY ADDITION: MODAL ALERT FOR ADD DOCUMENTS ===== */}
      {showAddDocs && (
        <div className="adddocs-overlay" onClick={() => setShowAddDocs(false)}>
          <div className="adddocs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adddocs-header">
              <h2>ADD DOCUMENTS</h2>

              <div className="adddocs-top-actions">
                <button className="adddocs-draft">Save Draft</button>
                <button className="adddocs-x" onClick={() => setShowAddDocs(false)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="adddocs-body">
              <div className="adddocs-field adddocs-search">
                <input placeholder="Search Documents" />
                <span className="adddocs-search-icon">🔍</span>
              </div>

              <select className="adddocs-field">
                <option>Document Type</option>
              </select>

              <select className="adddocs-field">
                <option>Application Name</option>
              </select>

              <select className="adddocs-field">
                <option>Origin Department</option>
              </select>

              <div className="adddocs-row">
                <select className="adddocs-field">
                  <option>Priority</option>
                </select>

                <select className="adddocs-field">
                  <option>Normal</option>
                  <option>Urgent</option>
                </select>

                <input
                  className="adddocs-field"
                  value={`Date: ${new Date().toLocaleDateString()}`}
                  readOnly
                />
              </div>

              <div className="adddocs-footer">
                <div className="adddocs-left">
                  <button className="adddocs-small">⬆ Upload Files</button>
                  <button className="adddocs-small">📁 View Files</button>
                </div>

                <div className="adddocs-right">
                  <button className="adddocs-save">Save</button>
                  <button className="adddocs-cancel" onClick={() => setShowAddDocs(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ===== END MODAL ===== */}
    </div>
  );
}

export default Dashboard;