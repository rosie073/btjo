import React, { useMemo, useRef, useState } from "react";
import "../ui/Dashboard.css";
import { useNavigate } from "react-router-dom";

// images (src/assets/)
import seal from "../assets/logo.jpg";
import ProfileMenu from "../components/ProfileMenu";

// lucide icons
import {
  Bell,
  User,
  X,
  Menu,
  Search,
  ChevronDown,
  Upload,
  FolderOpen,
  CalendarDays,
  FileText,
  ClipboardList,
  CheckSquare,
  Clock3,
  Siren,
  TriangleAlert,
  LayoutDashboard,
  Files,
  MapPinned,
  Building2,
  BarChart3,
  Settings,
  CircleHelp,
  LogOut,
  Shield,
  Wrench,
  Landmark,
} from "lucide-react";

function Dashboard() {
  const [showAddDocs, setShowAddDocs] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const dateInputRef = useRef(null);
  const navigate = useNavigate();

  const departments = [
    "Mayor",
    "Tourism",
    "PESO",
    "MDRRMO",
    "SB",
    "MPDC",
    "MCR",
    "MBO",
    "Acountant",
    "MTO",
    "Assessor",
    "MHO",
    "Parks & Plaza",
    "MSWO",
    "MENRO",
    "ME",
    "Streets & Bridges",
    "20% LDF",
    "Waterworks",
    "Markets",
    "Zero Waste",
    "PNP",
    "DILG",
    "COMELEC",
    "BFP",
    "Coast Guard",
    "DepED Elementary",
    "DepED High School",
  ];

  const statuses = ["Pending", "Declined", "Returned", "Completed", "Incoming"];

  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
    dateRange: "",
  });

  const [docForm, setDocForm] = useState({
    search: "",
    documentType: "",
    applicationName: "",
    originDepartment: "",
    priorityLabel: "Priority",
    priorityLevel: "Normal",
    date: new Date().toISOString().split("T")[0],
  });

  const stats = [
    {
      label: "Total Documents",
      value: 211,
      className: "blue",
      icon: <FileText size={15} strokeWidth={2.2} />,
    },
    {
      label: "In Progress",
      value: 56,
      className: "green",
      icon: <ClipboardList size={15} strokeWidth={2.2} />,
    },
    {
      label: "Completed",
      value: 81,
      className: "mint",
      icon: <CheckSquare size={15} strokeWidth={2.2} />,
    },
    {
      label: "Overdue",
      value: 25,
      className: "amber",
      icon: <Clock3 size={15} strokeWidth={2.2} />,
    },
    {
      label: "Urgent",
      value: 10,
      className: "red",
      icon: <Siren size={15} strokeWidth={2.2} />,
    },
    {
      label: "Alert",
      value: 4,
      className: "navy",
      icon: <TriangleAlert size={15} strokeWidth={2.2} />,
    },
  ];

  const documents = [
    {
      id: "Doc - 1001",
      title: "Building Permit Request",
      origin: "Markets",
      current: "Mayor",
      status: "Declined",
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
      status: "Incoming",
      assign: "K. Pance",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "05/15/2026",
    },
    {
      id: "Doc - 1004",
      title: "Support Request",
      origin: "Tourism",
      current: "Mayor",
      status: "Returned",
      assign: "S. Edwards",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "03/15/2026",
    },
    {
      id: "Doc - 1005",
      title: "Business Permit",
      origin: "Mayor",
      current: "Mayor",
      status: "Completed",
      assign: "A. Mutter",
      received: "01/15/2026",
      updated: "02/15/2026",
      days: 5,
      due: "02/28/2026",
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
      icon: <Shield size={16} strokeWidth={2.2} />,
    },
    {
      title: "Engineering",
      total: 6,
      items: [
        { label: "In Progress", value: 6 },
        { label: "Overdue", value: 2 },
      ],
      tone: "mint",
      icon: <Wrench size={16} strokeWidth={2.2} />,
    },
    {
      title: "Mayor's Office",
      total: 5,
      items: [
        { label: "Reviewing", value: 3 },
        { label: "Completed", value: 2 },
      ],
      tone: "blue",
      icon: <Landmark size={16} strokeWidth={2.2} />,
    },
  ];

  const history = [
    { label: "Submitted by Applicant", date: "01/22/2026", type: "ok" },
    { label: "Sent to Tourism Dept.", date: "01/29/2026", type: "ok" },
    { label: "Reviewed by Engineering Dept.", date: "02/03/2026", type: "ok" },
    { label: "Returned for Revision", date: "02/10/2026", type: "bad" },
    { label: "Approved by Budget Office", date: "02/10/2026", type: "ok" },
  ];

  function onSignOut() {
    alert("Sign out clicked");
  }

  function handleDocChange(key, value) {
    setDocForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveDoc() {
    console.log("Saved document:", docForm);
    setShowAddDocs(false);
  }

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function parseDate(dateStr) {
    const [month, day, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

  const filteredDocuments = useMemo(() => {
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    return documents.filter((doc) => {
      const searchValue = filters.search.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        doc.id.toLowerCase().includes(searchValue) ||
        doc.title.toLowerCase().includes(searchValue) ||
        doc.origin.toLowerCase().includes(searchValue) ||
        doc.current.toLowerCase().includes(searchValue) ||
        doc.assign.toLowerCase().includes(searchValue);

      const matchesDepartment =
        !filters.department ||
        doc.origin === filters.department ||
        doc.current === filters.department;

      const matchesStatus =
        !filters.status || doc.status === filters.status;

      let matchesDateRange = true;
      const dueDate = parseDate(doc.due);

      if (filters.dateRange === "today") {
        matchesDateRange = dueDate.toDateString() === today.toDateString();
      } else if (filters.dateRange === "7days") {
        matchesDateRange = dueDate >= today && dueDate <= next7Days;
      } else if (filters.dateRange === "30days") {
        matchesDateRange = dueDate >= today && dueDate <= next30Days;
      } else if (filters.dateRange === "overdue") {
        matchesDateRange = dueDate < today;
      }

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesDateRange
      );
    });
  }, [documents, filters]);

  return (
    <div className="page">
      <div className="app-shell">
        <header className="topbar">
          <div className="topbar-left">
            <img className="seal" src={seal} alt="Seal" />
            <div className="topbar-title">Municipal Documents Dashboard</div>
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
    className="icon-btn icon-btn--menu"
    aria-label="Open menu"
    type="button"
    onClick={() => setNavOpen((v) => !v)}
  >
    <Menu size={18} strokeWidth={2.2} />
  </button>
</div>
        </header>

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

        <main className="main-card">
          <div className="section-head">
            <h3 className="section-title">Document Tracking</h3>

            <div className="filters">
              <div className="search-wrap">
                <input
                  className="search"
                  placeholder="Search Document..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
                <span className="search-icon">
                  <Search size={14} strokeWidth={2.2} />
                </span>
              </div>

              <select
                className="select"
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
              >
                <option value="">Filter : Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                className="select"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                className="select"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              >
                <option value="">Date Range</option>
                <option value="today">Due Today</option>
                <option value="7days">Next 7 Days</option>
                <option value="30days">Next 30 Days</option>
                <option value="overdue">Overdue</option>
              </select>
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
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((d) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="center" style={{ padding: "20px" }}>
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <section className="bottom-grid">
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
            </div>

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

            <div className="button-col">
              <button className="add-docs" onClick={() => setShowAddDocs(true)}>
                ADD DOCUMENTS
              </button>
            </div>
          </section>
        </main>
      </div>

      {navOpen && (
        <div className="nav-overlay" onClick={() => setNavOpen(false)}>
          <aside className="right-nav" onClick={(e) => e.stopPropagation()}>
            <button className="nav-close" onClick={() => setNavOpen(false)}>
              <X size={18} strokeWidth={2.2} />
            </button>

            <nav className="nav-list">
              <button className="nav-item active">
                <span className="nav-ico">
                  <LayoutDashboard size={16} strokeWidth={2.2} />
                </span>
                Dashboard
              </button>

              <button className="nav-item" onClick={() => navigate("/documents")}>
                <span className="nav-ico">
                  <Files size={16} strokeWidth={2.2} />
                </span>
                Documents
              </button>

              <button className="nav-item">
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

      {showAddDocs && (
        <div className="adddocs-overlay" onClick={() => setShowAddDocs(false)}>
          <div className="adddocs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adddocs-header">
              <div>
                <h2>ADD DOCUMENTS</h2>
                <p className="adddocs-subtitle">
                  Enter the document details and upload related files.
                </p>
              </div>

              <div className="adddocs-top-actions">
                <button className="adddocs-draft">Save Draft</button>
                <button
                  className="adddocs-x"
                  onClick={() => setShowAddDocs(false)}
                  aria-label="Close modal"
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="adddocs-body">
              <div className="adddocs-input-wrap adddocs-search-wrap">
                <input
                  className="adddocs-input"
                  placeholder="Search documents"
                  value={docForm.search}
                  onChange={(e) => handleDocChange("search", e.target.value)}
                />
                <Search className="adddocs-input-icon" size={18} />
              </div>

              <div className="adddocs-select-wrap">
                <select
                  className="adddocs-field"
                  value={docForm.documentType}
                  onChange={(e) => handleDocChange("documentType", e.target.value)}
                >
                  <option value="">Document Type</option>
                  <option value="Building Permit">Building Permit</option>
                  <option value="Business Permit">Business Permit</option>
                  <option value="SALN">SALN</option>
                  <option value="Support Request">Support Request</option>
                </select>
                <ChevronDown className="adddocs-select-icon" size={18} />
              </div>

              <div className="adddocs-select-wrap">
                <select
                  className="adddocs-field"
                  value={docForm.applicationName}
                  onChange={(e) => handleDocChange("applicationName", e.target.value)}
                >
                  <option value="">Application Name</option>
                  <option value="Permit Application">Permit Application</option>
                  <option value="Internal Request">Internal Request</option>
                  <option value="Office Endorsement">Office Endorsement</option>
                </select>
                <ChevronDown className="adddocs-select-icon" size={18} />
              </div>

              <div className="adddocs-select-wrap">
                <select
                  className="adddocs-field"
                  value={docForm.originDepartment}
                  onChange={(e) =>
                    handleDocChange("originDepartment", e.target.value)
                  }
                >
                  <option value="">Origin Department</option>
                  <option value="Mayor's Office">Mayor's Office</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Budget">Budget</option>
                  <option value="Tourism">Tourism</option>
                </select>
                <ChevronDown className="adddocs-select-icon" size={18} />
              </div>

              <div className="adddocs-row">
                <div className="adddocs-select-wrap">
                  <select
                    className="adddocs-field"
                    value={docForm.priorityLabel}
                    onChange={(e) => handleDocChange("priorityLabel", e.target.value)}
                  >
                    <option value="Priority">Priority</option>
                    <option value="Classification">Classification</option>
                  </select>
                  <ChevronDown className="adddocs-select-icon" size={18} />
                </div>

                <div className="adddocs-select-wrap">
                  <select
                    className="adddocs-field"
                    value={docForm.priorityLevel}
                    onChange={(e) => handleDocChange("priorityLevel", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                  </select>
                  <ChevronDown className="adddocs-select-icon" size={18} />
                </div>

                <div className="adddocs-input-wrap adddocs-date-wrap">
                  <input
                    ref={dateInputRef}
                    type="date"
                    className="adddocs-field adddocs-date-input"
                    value={docForm.date}
                    onChange={(e) => handleDocChange("date", e.target.value)}
                  />

                  <button
                    type="button"
                    className="adddocs-date-btn"
                    aria-label="Open calendar"
                    onClick={() => {
                      if (dateInputRef.current) {
                        if (dateInputRef.current.showPicker) {
                          dateInputRef.current.showPicker();
                        } else {
                          dateInputRef.current.focus();
                        }
                      }
                    }}
                  >
                    <CalendarDays size={18} />
                  </button>
                </div>
              </div>

              <div className="adddocs-footer">
                <div className="adddocs-left">
                  <button className="adddocs-small" type="button">
                    <Upload size={16} />
                    <span>Upload Files</span>
                  </button>

                  <button className="adddocs-small adddocs-small--light" type="button">
                    <FolderOpen size={16} />
                    <span>View Files</span>
                  </button>
                </div>

                <div className="adddocs-right">
                  <button className="adddocs-save" onClick={handleSaveDoc}>
                    Save
                  </button>
                  <button
                    className="adddocs-cancel"
                    onClick={() => setShowAddDocs(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;