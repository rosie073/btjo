import React from "react";
import "./Dashboard.css";

function Dashboard() {
  const stats = [
    { label: "Total Documents", value: 211, className: "blue" },
    { label: "In Progress", value: 56, className: "green" },
    { label: "Completed", value: 81, className: "mint" },
    { label: "Overdue", value: 25, className: "amber" },
    { label: "Urgent", value: 10, className: "red" },
    { label: "Alert", value: 4, className: "navy" },
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
  ];

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="topbar">
        <h2>Municipal Documents Dashboard</h2>
      </div>

      {/* Stats */}
      <div className="stats">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.className}`}>
            <span>{stat.label}</span>
            <h3>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="table-section">
        <h3>Document Tracking</h3>

        <div className="filters">
          <input type="text" placeholder="Search Document..." />
          <select>
            <option>Filter: Department</option>
          </select>
          <select>
            <option>Status</option>
          </select>
          <select>
            <option>Date Range</option>
          </select>
          <button>🔍</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Doc ID</th>
              <th>Title</th>
              <th>Origin</th>
              <th>Current</th>
              <th>Status</th>
              <th>Assign To</th>
              <th>Received</th>
              <th>Updated</th>
              <th>Days</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                <td>{doc.id}</td>
                <td>{doc.title}</td>
                <td>{doc.origin}</td>
                <td>{doc.current}</td>
                <td>
                  <span className={`status ${doc.status.toLowerCase()}`}>
                    {doc.status}
                  </span>
                </td>
                <td>{doc.assign}</td>
                <td>{doc.received}</td>
                <td>{doc.updated}</td>
                <td>{doc.days}</td>
                <td>{doc.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Button */}
      <div className="add-btn-container">
        <button className="add-btn">ADD DOCUMENTS</button>
      </div>
    </div>
  );
}

export default Dashboard;