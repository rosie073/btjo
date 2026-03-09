import React from "react";
import { useNavigate } from "react-router-dom";
import "../ui/Trackingmain.css";
import logo from "../assets/logo.jpg";

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

  return (
    <div className="tracking-page">
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
    </div>
  );
}