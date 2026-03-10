import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ui/NotificationPage.css";
import seal from "../assets/logo.jpg";
import ProfileMenu from "../components/ProfileMenu";
import AppModal from "../components/AppModal";

import {
  Bell,
  Mail,
  Ban,
  Trash2,
  Printer,
  AlertCircle,
  CheckCircle2,
  X,
  Menu,
  LayoutDashboard,
  Files,
  MapPinned,
  Building2,
  BarChart3,
  Settings,
  CircleHelp,
  LogOut,
  Clock3,
} from "lucide-react";

import { getDocuments, seedDocuments } from "../data/documentStore";

export default function NotificationPage() {
  const navigate = useNavigate();

  const [navOpen, setNavOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selected, setSelected] = useState([]);
  const [mutedIds, setMutedIds] = useState([]);
  const [readIds, setReadIds] = useState([]);

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "alert",
    onConfirm: null,
  });

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

  function parseDate(dateString) {
    if (!dateString || !dateString.includes("/")) return new Date("");
    const [month, day, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
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

  function closeModal() {
    setModal({
      open: false,
      title: "",
      message: "",
      type: "alert",
      onConfirm: null,
    });
  }

  function onSignOut() {
    showAlertModal("Sign Out", "Sign out clicked.");
  }

  const notifications = useMemo(() => {
    const today = new Date();

    return documents.flatMap((doc) => {
      const items = [];
      const dueDate = parseDate(doc.due);
      const isOverdue = !Number.isNaN(dueDate.getTime()) && dueDate < today;

      if (isOverdue) {
        items.push({
          id: `${doc.id}-overdue`,
          docId: doc.id,
          title: "Overdue Documents",
          message: `${doc.title} is overdue. Please address this immediately.`,
          type: "danger",
          status: "Overdue",
          date: doc.updated || doc.due || doc.received,
        });
      }

      if (doc.status === "Returned") {
        items.push({
          id: `${doc.id}-returned`,
          docId: doc.id,
          title: "Returned for Corrections",
          message: `${doc.title} was returned for corrections. Kindly make the necessary changes and resubmit.`,
          type: "danger",
          status: "Returned",
          date: doc.updated || doc.received,
        });
      }

      if (doc.status === "Completed") {
        items.push({
          id: `${doc.id}-completed`,
          docId: doc.id,
          title: "Approved",
          message: `${doc.title} has been approved/completed.`,
          type: "success",
          status: "Completed",
          date: doc.updated || doc.received,
        });
      }

      if (doc.status === "Incoming") {
        items.push({
          id: `${doc.id}-incoming`,
          docId: doc.id,
          title: "Ready for Release / Claiming",
          message: `${doc.title} is currently incoming and ready for further processing or release.`,
          type: "print",
          status: "Incoming",
          date: doc.updated || doc.received,
        });
      }

      if (doc.status === "Pending") {
        items.push({
          id: `${doc.id}-pending`,
          docId: doc.id,
          title: "Follow-Up Required",
          message: `${doc.title} still needs follow-up action to continue processing.`,
          type: "warning",
          status: "Pending",
          date: doc.updated || doc.received,
        });
      }

      if (doc.status === "Declined") {
        items.push({
          id: `${doc.id}-declined`,
          docId: doc.id,
          title: "Document Declined",
          message: `${doc.title} was declined. Please review the document status and next steps.`,
          type: "danger",
          status: "Declined",
          date: doc.updated || doc.received,
        });
      }

      return items;
    });
  }, [documents]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => !mutedIds.includes(item.id));
  }, [notifications, mutedIds]);

  function handleSelectAll(e) {
    if (e.target.checked) {
      setSelected(visibleNotifications.map((item) => item.id));
    } else {
      setSelected([]);
    }
  }

  function handleSelectOne(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleMarkSelectedRead() {
    if (selected.length === 0) {
      showAlertModal("No Selection", "Please select at least one notification.");
      return;
    }

    setReadIds((prev) => [...new Set([...prev, ...selected])]);
    setSelected([]);
    showAlertModal("Success", "Selected notifications marked as read.");
  }

  function handleMuteSelected() {
    if (selected.length === 0) {
      showAlertModal("No Selection", "Please select at least one notification.");
      return;
    }

    setMutedIds((prev) => [...new Set([...prev, ...selected])]);
    setSelected([]);
    showAlertModal("Muted", "Selected notifications have been muted.");
  }

  function handleDeleteSelected() {
    if (selected.length === 0) {
      showAlertModal("No Selection", "Please select at least one notification.");
      return;
    }

    setMutedIds((prev) => [...new Set([...prev, ...selected])]);
    setReadIds((prev) => prev.filter((id) => !selected.includes(id)));
    setSelected([]);
    showAlertModal("Deleted", "Selected notifications were removed from the list.");
  }

  function handleAlertSelected() {
    if (selected.length === 0) {
      showAlertModal("No Selection", "Please select at least one notification.");
      return;
    }

    showAlertModal("Alert Sent", "Alert action triggered for selected notifications.");
  }

  function handleMuteOne(id) {
    setMutedIds((prev) => [...new Set([...prev, id])]);
  }

  function handleDeleteOne(id) {
    setMutedIds((prev) => [...new Set([...prev, id])]);
    setReadIds((prev) => prev.filter((item) => item !== id));
    setSelected((prev) => prev.filter((item) => item !== id));
  }

  function handleMarkOneRead(id) {
    setReadIds((prev) => [...new Set([...prev, id])]);
  }

  function getIcon(type) {
    switch (type) {
      case "danger":
        return (
          <div className="notif-icon danger">
            <AlertCircle size={16} />
          </div>
        );
      case "success":
        return (
          <div className="notif-icon success">
            <CheckCircle2 size={16} />
          </div>
        );
      case "print":
        return (
          <div className="notif-icon print">
            <Printer size={16} />
          </div>
        );
      case "warning":
        return (
          <div className="notif-icon warning">
            <Clock3 size={16} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="notification-shell-page">
      <div className="notification-shell">
        <header className="notification-topbar">
          <div className="notification-topbar-left">
            <img className="notification-seal" src={seal} alt="Seal" />
            <div className="notification-topbar-title">
              Municipal Documents Dashboard
            </div>
          </div>

          <div className="notification-topbar-right">
            <button className="notification-icon-btn" type="button">
              <Bell size={18} />
            </button>

            <ProfileMenu />

            <button className="notification-icon-btn" type="button">
              <X size={18} />
            </button>

            <button
              className="notification-icon-btn"
              type="button"
              onClick={() => setNavOpen((v) => !v)}
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        <main className="notification-page">
          <div className="notification-header">
            <h1>All Notification</h1>
            <button className="filter-btn" type="button">
              Filter
            </button>
          </div>

          <div className="notification-panel">
            <div className="notification-toolbar">
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={
                    visibleNotifications.length > 0 &&
                    selected.length === visibleNotifications.length
                  }
                  onChange={handleSelectAll}
                />
              </label>

              <div className="toolbar-actions">
                <button type="button" onClick={handleMarkSelectedRead}>
                  Mark selected as read
                </button>
                <button type="button" onClick={handleAlertSelected}>
                  Alert Selected
                </button>
                <button type="button" onClick={handleMuteSelected}>
                  Mute Selected
                </button>
                <button
                  type="button"
                  className="danger-btn"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected
                </button>
              </div>
            </div>

            <div className="notification-list">
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map((item) => (
                  <div
                    className={`notification-row ${
                      readIds.includes(item.id) ? "is-read" : ""
                    }`}
                    key={item.id}
                  >
                    <div className="row-left">
                      <label className="checkbox-wrap">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => handleSelectOne(item.id)}
                        />
                      </label>

                      {getIcon(item.type)}

                      <div
                        className="notification-content"
                        onClick={() => navigate(`/tracking/${item.docId}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <h3>
                          {item.title}{" "}
                          <span className="notif-doc-ref">({item.docId})</span>
                        </h3>
                        <p>{item.message}</p>
                        <div className="notif-meta">
                          <span className="notif-status">{item.status}</span>
                          <span className="notif-date">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="row-actions">
                      <Trash2 size={15} onClick={() => handleDeleteOne(item.id)} />
                      <Ban size={15} onClick={() => handleMuteOne(item.id)} />
                      <Bell size={15} onClick={() => handleMarkOneRead(item.id)} />
                      <Mail size={15} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="notification-empty">
                  No notifications available.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {navOpen && (
        <div className="docs-nav-overlay" onClick={() => setNavOpen(false)}>
          <aside
            className="docs-right-nav"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="nav-close" onClick={() => setNavOpen(false)}>
              <X size={18} />
            </button>

            <nav className="docs-nav-list">
              <button
                className="docs-nav-item"
                onClick={() => navigate("/dashboard")}
              >
                <span className="docs-nav-ico">
                  <LayoutDashboard size={16} />
                </span>
                Dashboard
              </button>

              <button
                className="docs-nav-item"
                onClick={() => navigate("/documents")}
              >
                <span className="docs-nav-ico">
                  <Files size={16} />
                </span>
                Documents
              </button>

              <button
                className="docs-nav-item"
                onClick={() => navigate("/tracking")}
              >
                <span className="docs-nav-ico">
                  <MapPinned size={16} />
                </span>
                Tracking
              </button>

              <button
                className="docs-nav-item active"
                onClick={() => navigate("/notifications")}
              >
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