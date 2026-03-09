import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../ui/Trackingdetails.css";
import logo from "../assets/logo.jpg";

const documents = [

  {
    docId: "DOC-1001",
    displayId: "DOC - 1001",
    title: "Building Permit Request",
    currentDepartment: "Mayor",
    currentOfficer: "J. Silvalism",
    currentStatus: "Decline",
    dateReceived: "01/15/2026",
    lastUpdate: "02/15/2026",
    slaRemaining: "2 days",
    history: [
      {
        step: 1,
        department: "Market",
        assignTo: "J. Silvalism",
        action: "Reviewed",
        date: "01/15/2026",
        daysInDept: 5,
        remarks: "",
      },
    ],
  },
  {
    docId: "DOC-1002",
    displayId: "DOC - 1002",
    title: "Approval Document",
    currentDepartment: "Mayor",
    currentOfficer: "D. Coley",
    currentStatus: "Return",
    dateReceived: "01/15/2026",
    lastUpdate: "02/15/2026",
    slaRemaining: "3 days",
    history: [
      {
        step: 1,
        department: "Mayor",
        assignTo: "D. Coley",
        action: "Returned",
        date: "01/15/2026",
        daysInDept: 5,
        remarks: "",
      },
    ],
  },
  {
    docId: "DOC-1003",
    displayId: "DOC - 1003",
    title: "SALN",
    currentDepartment: "Mayor",
    currentOfficer: "J. Silvalism",
    currentStatus: "Pending",
    dateReceived: "01/15/2026",
    lastUpdate: "02/15/2026",
    slaRemaining: "2 days",
    history: [
      {
        step: 1,
        department: "SB",
        assignTo: "K. Pance",
        action: "Reviewed",
        date: "01/15/2026",
        daysInDept: 5,
        remarks: "",
      },
    ],
  },
];

export default function Trackingdetails() {
  const { docId } = useParams();
  const navigate = useNavigate();

  const document = documents.find((doc) => doc.docId === docId);

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
          <button className="icon-btn" type="button">🔔</button>
          <button className="icon-btn" type="button">🔔</button>
          <button className="icon-btn circle-btn" type="button">✕</button>
          <button className="icon-btn" type="button">☰</button>
        </div>
      </header>

      <div className="top-divider"></div>

        <section className="content-head">
        <div className="content-head-inner">

            <div className="tracking-title">
            <span
                className="back-arrow"
                onClick={() => navigate("/tracking")}
            >
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
                    <button className="btn btn-forward" type="button">⟶ Forward</button>
                    <button className="btn btn-return" type="button">⬅ Return</button>
                    <button className="btn btn-decline" type="button">✕ Decline</button>
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
          <div className="timeline-bar timeline-green"></div>
          <div className="timeline-bar timeline-blue"></div>
          <div className="timeline-bar timeline-gray"></div>

          <div className="timeline-step">
            <div className="timeline-circle green">✕</div>
            <div className="timeline-label">Submitted</div>
          </div>

          <div className="timeline-step">
            <div className="timeline-circle blue">🏢</div>
            <div className="timeline-label">SB</div>
          </div>

          <div className="timeline-step">
            <div className="timeline-circle gray">🏢</div>
            <div className="timeline-label">Mayor</div>
          </div>

          <div className="timeline-step">
            <div className="timeline-circle gray">⚖</div>
            <div className="timeline-label">Legal</div>
          </div>

          <div className="timeline-step">
            <div className="timeline-circle gray">✓</div>
            <div className="timeline-label">Completed</div>
          </div>
        </div>

        <div className="movement-box">
          <div className="section-header movement-header">
            <span className="section-icon">📄</span>
            <span>Movement History</span>
          </div>

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
              {document.history.map((item) => (
                <tr key={item.step}>
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

        <div className="remarks-box">
          <div className="section-header remarks-header">
            <span className="section-icon">📝</span>
            <span>Add Remarks</span>
          </div>

          <div className="remarks-content">
            <input type="text" placeholder="Add Remarks......" />
            <button type="button">Add Remarks</button>
          </div>
        </div>
      </main>
    </div>
  );
}