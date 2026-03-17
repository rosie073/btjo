import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../ui/Trackingdetails.css";
import logo from "../assets/logo.jpg";
import ProfileMenu from "../components/ProfileMenu";
import { getDocuments, seedDocuments, updateDocument } from "../data/documentStore";

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

export default function Trackingdetails() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [document, setDocument] = useState(null);
  const [remarkText, setRemarkText] = useState("");
  const [savedRemark, setSavedRemark] = useState("");

  useEffect(() => {
    seedDocuments();
    loadDocument();

    const refresh = () => loadDocument();
    window.addEventListener("documentsUpdated", refresh);

    return () => {
      window.removeEventListener("documentsUpdated", refresh);
    };
  }, [docId]);

  function loadDocument() {
    const savedDocs = getDocuments();
    const foundDoc = savedDocs.find((doc) => doc.id === docId);

    if (!foundDoc) {
      setDocument(null);
      return;
    }

    const formattedDoc = {
      ...foundDoc,
      docId: foundDoc.id,
      displayId: foundDoc.id,
      currentDepartment: foundDoc.current || foundDoc.origin || "",
      currentOfficer: foundDoc.assign || "Unassigned",
      currentStatus: foundDoc.status || "Incoming",
      dateReceived: foundDoc.received || "",
      lastUpdate: foundDoc.updated || "",
      route: foundDoc.route || [foundDoc.origin],
      slaRemaining: `${foundDoc.days ?? 0} days`,
      history: foundDoc.history || [
        {
          step: 1,
          department: foundDoc.origin || "",
          assignTo: foundDoc.assign || "Unassigned",
          action: "Created",
          date: foundDoc.received || "",
          daysInDept: foundDoc.days ?? 0,
          remarks: "",
        },
      ],
    };

    setDocument(formattedDoc);
  }

  function formatToday() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
  }

  function getNextDepartment(currentDept) {
    const route = document?.route || [];
    const currentIndex = route.indexOf(currentDept);

    if (currentIndex === -1) return currentDept;
    if (currentIndex >= route.length - 1) return currentDept;

    return route[currentIndex + 1];
  }

  function getPreviousDepartment(currentDept) {
  const route = document?.route || [];
  const currentIndex = route.indexOf(currentDept);

  if (currentIndex <= 0) return currentDept;

  return route[currentIndex - 1];
  }

  function getTimelineClass(stepDept) {
    const route = document?.route || [];
    const currentDept = document?.currentDepartment || "";
    const currentIndex = route.indexOf(currentDept);
    const stepIndex = route.indexOf(stepDept);

    if (stepDept === currentDept) return "blue";
    if (stepIndex !== -1 && currentIndex !== -1 && stepIndex < currentIndex) {
      return "green";
    }
    return "gray";
  }

  function getTimelineIcon(dept, index) {
    if (index === 0) return "✕";
    if (dept === "Legal") return "⚖";
    if (dept === "Completed") return "✓";
    return "🏢";
  }

  function handleAddRemark() {
    if (!remarkText.trim()) return;
    setSavedRemark(remarkText.trim());
  }

  function handleForward() {
    if (!document) return;

    const today = formatToday();
    const nextDepartment = getNextDepartment(document.currentDepartment);
    const remarkToUse = savedRemark || remarkText.trim();

    const newHistoryRow = {
      step: document.history.length + 1,
      department: nextDepartment,
      assignTo: "Unassigned",
      action: "Forwarded",
      date: today,
      daysInDept: 0,
      remarks: remarkToUse,
    };

    const updatedDoc = {
      ...document,
      currentDepartment: nextDepartment,
      currentOfficer: "Unassigned",
      currentStatus: "Pending",
      lastUpdate: today,
      history: [...document.history, newHistoryRow],
    };

    setDocument(updatedDoc);

    updateDocument({
      ...document,
      id: document.docId,
      current: nextDepartment,
      assign: "Unassigned",
      status: "Pending",
      updated: today,
      route: document.route,
      history: [...document.history, newHistoryRow],
    });

    setRemarkText("");
    setSavedRemark("");
    window.dispatchEvent(new Event("documentsUpdated"));
  }

  function handleReturn() {
  if (!document) return;

  const today = formatToday();
  const previousDepartment = getPreviousDepartment(document.currentDepartment);
  const remarkToUse = savedRemark || remarkText.trim();

  const newHistoryRow = {
    step: document.history.length + 1,
    department: previousDepartment,
    assignTo: "Unassigned",
    action: "Returned",
    date: today,
    daysInDept: 0,
    remarks: remarkToUse,
  };

  const updatedDoc = {
    ...document,
    currentDepartment: previousDepartment,
    currentOfficer: "Unassigned",
    currentStatus: "Returned",
    lastUpdate: today,
    history: [...document.history, newHistoryRow],
  };

  setDocument(updatedDoc);

  updateDocument({
    ...document,
    id: document.docId,
    current: previousDepartment,
    assign: "Unassigned",
    status: "Returned",
    updated: today,
    route: document.route,
    history: [...document.history, newHistoryRow],
  });

  setRemarkText("");
  setSavedRemark("");
  window.dispatchEvent(new Event("documentsUpdated"));
}

  function onSignOut() {
    alert("Sign out clicked.");
  }

  if (!document) {
    return <div className="not-found">Document not found.</div>;
  }

  return (
    <div className="tracking-details-page">
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

      <div className="top-divider"></div>

      <section className="content-head">
        <div className="content-head-inner">
          <div className="tracking-title">
            <span className="back-arrow" onClick={() => navigate("/tracking")}>
              ←
            </span>

            <h2>Tracking Documents</h2>
          </div>

          <div className="search-box">
            <input type="text" placeholder="Search Document ID..." />
            <span className="search-icon">⌕</span>
          </div>
        </div>
      </section>

      <main className="details-wrapper">
        <div className="document-card">
          <div className="document-card-header">
            <div className="header-left">
              <h1>
                {document.displayId} - {document.title}
              </h1>
            </div>

            <div className="action-buttons">
              <button className="btn btn-forward" type="button" onClick={handleForward}>
                ⟶ Forward
              </button>
              <button
                className="btn btn-return"
                type="button"
                onClick={handleReturn}
              >
                ⬅ Return
              </button>
              
              <button className="btn btn-decline" type="button">
                ✕ Decline
              </button>
            </div>
          </div>

          <div className="document-info">
            <div className="info-left">
              <p>
                <span className="label">Current Department:</span>
                <span className="value">{document.currentDepartment}</span>
              </p>
              <p>
                <span className="label">Current Officer:</span>
                <span className="value">{document.currentOfficer}</span>
              </p>
              <p>
                <span className="label">Current Status:</span>
                <span className={`status-badge ${document.currentStatus.toLowerCase()}`}>
                  {document.currentStatus}
                </span>
              </p>
              <p>
                <span className="label">SLA Remaining:</span>
                <span className="value">{document.slaRemaining}</span>
              </p>
            </div>

            <div className="info-right">
              <p>
                <span className="label">Date Received:</span>
                <span className="value">{document.dateReceived}</span>
              </p>
              <p>
                <span className="label">Last Update:</span>
                <span className="value">{document.lastUpdate}</span>
              </p>
            </div>
          </div>
        </div>

       <div className="timeline-wrapper">
            {document.route.map((dept, index) => {
              const circleClass = getTimelineClass(dept);
              const isLast = index === document.route.length - 1;

              return (
                <div className="timeline-step" key={`${dept}-${index}`}>
                  {!isLast && (
                    <div className={`timeline-connector ${circleClass}`}></div>
                  )}

                  <div className={`timeline-circle ${circleClass}`}>
                    {getTimelineIcon(dept, index)}
                  </div>

                  <div className="timeline-label">{dept}</div>
                </div>
              );
            })}
          </div>

        <div className="movement-box">
          <div className="section-header movement-header">
            <span className="section-icon">📄</span>
            <span>Movement History</span>
          </div>  

          <div className="movement-table-wrap">
          <table className="movement-table">
            <thead>
              <tr>
                <th>Step</th>
                <th>Department</th>
                <th>Assign To</th>
                <th>Action</th>
                <th>Date</th>
                <th>Days In Dept.</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {document.history.map((item, index) => (
                <tr key={`${item.step}-${index}`}>
                  <td>{item.step}</td>
                  <td>{item.department}</td>
                  <td>{item.assignTo}</td>
                  <td>{item.action}</td>
                  <td>{item.date}</td>
                  <td>{item.daysInDept}</td>
                  <td>{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="remarks-box">
          <div className="section-header remarks-header">
            <span className="section-icon">📝</span>
            <span>Add Remarks</span>
          </div>

          <div className="remarks-content">
            <input
              type="text"
              placeholder="Add Remarks......"
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
            />
            <button type="button" onClick={handleAddRemark}>
              Add Remarks
            </button>
          </div>
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

              <button
                className="nav-item"
                onClick={() => navigate("/notifications")}
              >
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