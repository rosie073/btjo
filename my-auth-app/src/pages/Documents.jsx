import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../ui/Documents.css";

import seal from "../assets/logo.jpg";

import ProfileMenu from "../components/ProfileMenu";
import AppModal from "../components/AppModal";

import {
  Bell,
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
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getDocuments,
  updateDocument,
  deleteDocument,
  seedDocuments,
} from "../data/documentStore";

export default function Documents() {
  const navigate = useNavigate();
  const location = useLocation();

  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Files");
  const [documents, setDocuments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "alert",
    onConfirm: null,
  });

  const [editingDoc, setEditingDoc] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    origin: "",
    current: "",
    status: "",
    assign: "",
    received: "",
    updated: "",
    days: 0,
    due: "",
    priority: "Normal",
  });

  const departments = [
    "Mayor",
    "Tourism",
    "PESO",
    "MDRRMO",
    "SB",
    "MPDC",
    "MCR",
    "MBO",
    "Accountant",
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

  useEffect(() => {
    seedDocuments();
    loadDocuments();

    const refresh = () => loadDocuments();
    window.addEventListener("documentsUpdated", refresh);

    return () => {
      window.removeEventListener("documentsUpdated", refresh);
    };
  }, []);

  function loadDocuments() {
    setDocuments(getDocuments());
  }

  function showAlertModal(title, message, callback = null) {
    setModal({
      open: true,
      title,
      message,
      type: "alert",
      onConfirm: callback,
    });
  }

  function showConfirmModal(title, message, callback) {
    setModal({
      open: true,
      title,
      message,
      type: "confirm",
      onConfirm: callback,
    });
  }

  function closeModal() {
    setModal({
      open: false,
      title: "",
      message: "",
      type: "alert",
      onConfirm: null,
    });
  }

  const tabs = [
    "All Files",
    "Pending",
    "Declined",
    "Returned",
    "Completed",
    "Incoming",
  ];

  function parseDate(dateString) {
    if (!dateString || !dateString.includes("/")) return new Date("");
    const [month, day, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

  function isWithinDateRange(doc, range) {
    if (!range) return true;

    const today = new Date();
    const receivedDate = parseDate(doc.received);

    if (Number.isNaN(receivedDate.getTime())) return false;

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    switch (range) {
      case "today":
        return receivedDate.toDateString() === startOfToday.toDateString();

      case "last7days": {
        const last7 = new Date(startOfToday);
        last7.setDate(startOfToday.getDate() - 7);
        return receivedDate >= last7 && receivedDate <= today;
      }

      case "last30days": {
        const last30 = new Date(startOfToday);
        last30.setDate(startOfToday.getDate() - 30);
        return receivedDate >= last30 && receivedDate <= today;
      }

      case "thisMonth":
        return (
          receivedDate.getMonth() === today.getMonth() &&
          receivedDate.getFullYear() === today.getFullYear()
        );

      case "thisYear":
        return receivedDate.getFullYear() === today.getFullYear();

      default:
        return true;
    }
  }

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesTab =
        activeTab === "All Files" ? true : doc.status === activeTab;

      const matchesSearch =
        searchTerm.trim() === ""
          ? true
          : [
              doc.id,
              doc.title,
              doc.origin,
              doc.current,
              doc.assign,
              doc.status,
            ]
              .join(" ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === ""
          ? true
          : doc.origin === departmentFilter || doc.current === departmentFilter;

      const matchesStatus =
        statusFilter === "" ? true : doc.status === statusFilter;

      const matchesDate = isWithinDateRange(doc, dateRangeFilter);

      return (
        matchesTab &&
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    documents,
    activeTab,
    searchTerm,
    departmentFilter,
    statusFilter,
    dateRangeFilter,
  ]);

  const counts = {
    "All Files": documents.length,
    Pending: documents.filter((d) => d.status === "Pending").length,
    Declined: documents.filter((d) => d.status === "Declined").length,
    Returned: documents.filter((d) => d.status === "Returned").length,
    Completed: documents.filter((d) => d.status === "Completed").length,
    Incoming: documents.filter((d) => d.status === "Incoming").length,
  };

  function onSignOut() {
    showAlertModal("Sign Out", "Sign out clicked.");
  }

  function handleDelete(id) {
    showConfirmModal(
      "Delete Document",
      "Are you sure you want to delete this document?",
      () => {
        deleteDocument(id);
        loadDocuments();
        showAlertModal("Deleted", "Document deleted successfully.");
      }
    );
  }

  function handleEditClick(doc) {
    setEditingDoc(doc);
    setEditForm({
      title: doc.title || "",
      origin: doc.origin || "",
      current: doc.current || "",
      status: doc.status || "",
      assign: doc.assign || "",
      received: doc.received || "",
      updated: doc.updated || "",
      days: doc.days || 0,
      due: doc.due || "",
      priority: doc.priority || "Normal",
    });
  }

  function clearFilters() {
    setSearchTerm("");
    setDepartmentFilter("");
    setStatusFilter("");
    setDateRangeFilter("");
    setActiveTab("All Files");
  }

  function handleEditSave() {
    if (!editingDoc) return;

    if (
      !editForm.title ||
      !editForm.origin ||
      !editForm.current ||
      !editForm.status
    ) {
      showAlertModal(
        "Missing Required Fields",
        "Please complete the required document information before saving."
      );
      return;
    }

    updateDocument({
      ...editingDoc,
      ...editForm,
      days: Number(editForm.days) || 0,
    });

    setEditingDoc(null);
    loadDocuments();
    showAlertModal("Success", "Document updated successfully.");
  }

  function isActive(path) {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  return (
    <div className="docs-page">
      <div className="docs-shell">
        <header className="docs-topbar">
          <div className="docs-topbar-left">
            <img className="docs-seal" src={seal} alt="Seal"/>
            <div className="docs-topbar-title">Municipal Documents</div>
          </div>

          <div className="docs-topbar-right">
            <button
              className="docs-icon-btn"
              type="button"
              aria-label="Notifications"
              onClick={() => navigate("/notifications")}
            >
              <Bell size={18} />
            </button>


            <ProfileMenu />

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
                <input
                  className="docs-search"
                  placeholder="Search Document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="docs-search-icon">
                  <Search size={14} />
                </span>
              </div>

              <div className="docs-select-wrap">
                <select
                  className="docs-select"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">Filter : Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="docs-select-icon" />
              </div>

              <div className="docs-select-wrap small">
                <select
                  className="docs-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="docs-select-icon" />
              </div>

              <div className="docs-select-wrap">
                <select
                  className="docs-select"
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                >
                  <option value="">Date Range</option>
                  <option value="today">Today</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="thisYear">This Year</option>
                </select>
                <ChevronDown size={14} className="docs-select-icon" />
              </div>

              <button
                type="button"
                className="docs-clear-btn"
                onClick={clearFilters}
              >
                Clear Filters
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id + doc.title}>
                      <td>{doc.id}</td>
                      <td>{doc.title}</td>
                      <td>{doc.origin}</td>
                      <td>{doc.current}</td>
                      <td>
                        <span
                          className={`docs-status ${doc.status.toLowerCase()}`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td>{doc.assign}</td>
                      <td>{doc.received}</td>
                      <td>{doc.updated}</td>
                      <td className="center">{doc.days}</td>
                      <td>{doc.due}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleEditClick(doc)}
                            style={{
                              border: "none",
                              background: "#4f74db",
                              color: "#fff",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(doc.id)}
                            style={{
                              border: "none",
                              background: "#e24b4b",
                              color: "#fff",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="docs-empty">
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {navOpen && (
        <div className="nav-overlay" onClick={() => setNavOpen(false)}>
          <aside className="right-nav" onClick={(e) => e.stopPropagation()}>
            <button className="nav-close" onClick={() => setNavOpen(false)}>
              <X size={18} strokeWidth={2.2} />
            </button>

            <nav className="nav-list">
              <button
                className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
                onClick={() => navigate("/dashboard")}
              >
                <span className="nav-ico">
                  <LayoutDashboard size={16} strokeWidth={2.2} />
                </span>
                Dashboard
              </button>

              <button
                className={`nav-item ${isActive("/documents") ? "active" : ""}`}
                onClick={() => navigate("/documents")}
              >
                <span className="nav-ico">
                  <Files size={16} strokeWidth={2.2} />
                </span>
                Documents
              </button>

              <button
                className={`nav-item ${isActive("/tracking") ? "active" : ""}`}
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




              <button
                className={`nav-item ${isActive("/tracking") ? "active" : ""}`}
                onClick={() => navigate("/tracking")}
              >
                <span className="nav-ico">
                  <MapPinned size={16} strokeWidth={2.2} />
                </span>
                Tracking
              </button>

              <button
                className={`nav-item ${
                  isActive("/notifications") ? "active" : ""
                }`}
                onClick={() => navigate("/notifications")}
              >
                <span className="nav-ico">
                  <Bell size={16} strokeWidth={2.2} />
                </span>
                Notification
              </button>

              <button
                className={`nav-item ${
                  isActive("/departments") ? "active" : ""
                }`}
                onClick={() => navigate("/departments")}
              >
                <span className="nav-ico">
                  <Building2 size={16} strokeWidth={2.2} />
                </span>
                Departments
              </button>

              <button
                className={`nav-item ${isActive("/reports") ? "active" : ""}`}
                onClick={() => navigate("/reports")}
              >
                <span className="nav-ico">
                  <BarChart3 size={16} strokeWidth={2.2} />
                </span>
                Reports &amp; Analytics
              </button>

              <button
                className={`nav-item ${isActive("/settings") ? "active" : ""}`}
                onClick={() => navigate("/settings")}
              >
                <span className="nav-ico">
                  <Settings size={16} strokeWidth={2.2} />
                </span>
                Settings
              </button>

              <button
                className={`nav-item ${isActive("/help") ? "active" : ""}`}
                onClick={() => navigate("/help")}
              >
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

      {editingDoc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setEditingDoc(null)}
        >
          <div
            style={{
              width: "700px",
              maxWidth: "95%",
              background: "#fff",
              borderRadius: "18px",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "18px" }}>Edit Document</h2>

            <div style={{ display: "grid", gap: "12px" }}>
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Document Title"
              />
              <input
                value={editForm.origin}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, origin: e.target.value }))
                }
                placeholder="Origin Department"
              />
              <input
                value={editForm.current}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, current: e.target.value }))
                }
                placeholder="Current Department"
              />
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, status: e.target.value }))
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input
                value={editForm.assign}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, assign: e.target.value }))
                }
                placeholder="Assign To"
              />
              <input
                value={editForm.received}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, received: e.target.value }))
                }
                placeholder="Received Date (MM/DD/YYYY)"
              />
              <input
                value={editForm.updated}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, updated: e.target.value }))
                }
                placeholder="Last Update (MM/DD/YYYY)"
              />
              <input
                value={editForm.due}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, due: e.target.value }))
                }
                placeholder="Due Date (MM/DD/YYYY)"
              />
              <input
                type="number"
                value={editForm.days}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, days: e.target.value }))
                }
                placeholder="Days In Department"
              />
            </div>

            <div
              style={{
                marginTop: "18px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button onClick={() => setEditingDoc(null)}>Cancel</button>
              <button onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <AppModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onCancel={closeModal}
        onConfirm={() => {
          const callback = modal.onConfirm;
          closeModal();
          if (callback) callback();
        }}
      />
    </div>
  );
}