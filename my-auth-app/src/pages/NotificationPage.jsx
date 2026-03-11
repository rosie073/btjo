import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Check,
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
  const location = useLocation();

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

  function showAlertModal(title, message, callback = null, type = "alert") {
    setModal({
      open: true,
      title,
      message,
      type,
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
    showAlertModal(
      "Sign Out",
      "You have selected to sign out of the system.",
      null,
      "alert"
    );
  }

  const notifications = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
          message: `${doc.title} has been approved and completed successfully.`,
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
          message: `${doc.title} still requires follow-up action to continue processing.`,
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
          message: `${doc.title} was declined. Please review the document status and recommended next steps.`,
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
      showAlertModal(
        "No Selection",
        "Please select at least one notification to mark as read."
      );
      return;
    }

    setReadIds((prev) => [...new Set([...prev, ...selected])]);
    setSelected([]);
    showAlertModal(
      "Marked as Read",
      "The selected notifications have been marked as read successfully.",
      null,
      "success"
    );
  }

  function handleMuteSelected() {
    if (selected.length === 0) {
      showAlertModal(
        "No Selection",
        "Please select at least one notification to mute."
      );
      return;
    }

    setMutedIds((prev) => [...new Set([...prev, ...selected])]);
    setSelected([]);
    showAlertModal(
      "Notifications Muted",
      "The selected notifications have been muted and removed from the active list.",
      null,
      "success"
    );
  }

  function handleDeleteSelected() {
    if (selected.length === 0) {
      showAlertModal(
        "No Selection",
        "Please select at least one notification to delete."
      );
      return;
    }

    setMutedIds((prev) => [...new Set([...prev, ...selected])]);
    setReadIds((prev) => prev.filter((id) => !selected.includes(id)));
    setSelected([]);
    showAlertModal(
      "Notifications Deleted",
      "The selected notifications have been deleted from your current view.",
      null,
      "success"
    );
  }

  function handleAlertSelected() {
    if (selected.length === 0) {
      showAlertModal(
        "No Selection",
        "Please select at least one notification to send an alert."
      );
      return;
    }

    showAlertModal(
      "Alert Sent",
      "A follow-up alert has been triggered for the selected notifications.",
      null,
      "success"
    );
  }

  function handleMuteOne(id) {
    setMutedIds((prev) => [...new Set([...prev, id])]);
    setSelected((prev) => prev.filter((item) => item !== id));
    showAlertModal(
      "Notification Muted",
      "The notification has been muted and removed from the active list.",
      null,
      "success"
    );
  }

  function handleDeleteOne(id) {
    setMutedIds((prev) => [...new Set([...prev, id])]);
    setReadIds((prev) => prev.filter((item) => item !== id));
    setSelected((prev) => prev.filter((item) => item !== id));
    showAlertModal(
      "Notification Deleted",
      "The notification has been deleted from your current view.",
      null,
      "success"
    );
  }

  function handleMarkOneRead(id) {
    setReadIds((prev) => [...new Set([...prev, id])]);
    showAlertModal(
      "Marked as Read",
      "The notification has been marked as read.",
      null,
      "success"
    );
  }

  function handleSendEmail(item) {
    showAlertModal(
      "Email Notification",
      `An email notification has been prepared for ${item.docId} regarding "${item.title}".`,
      null,
      "success"
    );
  }

  function handleRefreshNotifications() {
    loadDocuments();
    showAlertModal(
      "Notifications Refreshed",
      "The notification list has been refreshed successfully.",
      null,
      "success"
    );
  }

  function handleClosePage() {
    navigate("/dashboard");
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

  function isActive(path) {
    if (path === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  return (
    <div className="notification-shell-page">
      <div className="notification-shell">
        <header className="notification-topbar">
          <div className="notification-topbar-left">
            <img className="notification-seal" src={seal} alt="Seal" />
            <div className="notification-topbar-title">
              Document Notifications
            </div>
          </div>

          <div className="notification-topbar-right">
            <button
              className="notification-icon-btn"
              type="button"
              onClick={handleRefreshNotifications}
              title="Refresh notifications"
            >
              <Bell size={18} />
            </button>

            <ProfileMenu />

            <button
              className="notification-icon-btn"
              type="button"
              onClick={handleClosePage}
              title="Close notifications"
            >
              <X size={18} />
            </button>

            <button
              className="notification-icon-btn"
              type="button"
              onClick={() => setNavOpen(true)}
              title="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        <main className="notification-page">
          <div className="notification-header">
            <h1>All Notification</h1>
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
                      <button
                        type="button"
                        className="row-action-btn"
                        title="Delete notification"
                        onClick={() => handleDeleteOne(item.id)}
                      >
                        <Trash2 size={15} />
                      </button>

                      <button
                        type="button"
                        className="row-action-btn"
                        title="Mute notification"
                        onClick={() => handleMuteOne(item.id)}
                      >
                        <Ban size={15} />
                      </button>

                      <button
                        type="button"
                        className="row-action-btn"
                        title="Mark as read"
                        onClick={() => handleMarkOneRead(item.id)}
                      >
                        <Check size={15} />
                      </button>

                      <button
                        type="button"
                        className="row-action-btn"
                        title="Send email notification"
                        onClick={() => handleSendEmail(item)}
                      >
                        <Mail size={15} />
                      </button>
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