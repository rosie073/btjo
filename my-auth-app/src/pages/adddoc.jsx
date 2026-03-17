import React, { useRef, useState } from "react";
import {
  X,
  Search,
  ChevronDown,
  CalendarDays,
  Upload,
  Paperclip,
  Trash2,
} from "lucide-react";

import { addDocument, generateDocId } from "../data/documentStore";
import "../ui/adddoc.css";

export default function AddDocumentsModal({
  open,
  onClose,
  onSaved,
  departments = [],
}) {
  const dateInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [docForm, setDocForm] = useState({
    search: "",
    documentType: "",
    applicationName: "",
    originDepartment: "",
    priorityLabel: "Priority",
    priorityLevel: "Normal",
    date: new Date().toISOString().split("T")[0],
    route: [],
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  function handleDocChange(key, value) {
    setDocForm((prev) => ({ ...prev, [key]: value }));
  }

  function formatInputDateToDisplay(dateValue) {
    if (!dateValue) return "";
    const [year, month, day] = dateValue.split("-");
    return `${month}/${day}/${year}`;
  }

  function handleUploadFiles() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  }

  function handleRemoveFile(indexToRemove) {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }

  function formatFileSize(size) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  function handleRouteToggle(dept) {
    setDocForm((prev) => {
      const exists = prev.route.includes(dept);

      if (exists) {
        return {
          ...prev,
          route: prev.route.filter((item) => item !== dept),
        };
      }

      return {
        ...prev,
        route: [...prev.route, dept],
      };
    });
  }

  function handleRemoveRouteItem(dept) {
    setDocForm((prev) => ({
      ...prev,
      route: prev.route.filter((item) => item !== dept),
    }));
  }

  function resetForm() {
    setDocForm({
      search: "",
      documentType: "",
      applicationName: "",
      originDepartment: "",
      priorityLabel: "Priority",
      priorityLevel: "Normal",
      date: new Date().toISOString().split("T")[0],
      route: [],
    });
    setUploadedFiles([]);
  }

  function handleSaveDoc() {
    if (
      !docForm.documentType ||
      !docForm.applicationName ||
      !docForm.originDepartment
    ) {
      alert(
        "Please fill in Document Type, Application Name, and Origin Department."
      );
      return;
    }

    if (docForm.route.length === 0) {
      alert("Please select at least one routing department.");
      return;
    }

    const displayDate = formatInputDateToDisplay(docForm.date);

    const finalRoute = [
      docForm.originDepartment,
      ...docForm.route.filter((dept) => dept !== docForm.originDepartment),
    ];

    const newDocument = {
      id: generateDocId(),
      title: docForm.applicationName,
      origin: docForm.originDepartment,
      current: docForm.originDepartment,
      status: "Incoming",
      assign: "Unassigned",
      received: displayDate,
      updated: displayDate,
      days: 0,
      due: displayDate,
      priority: docForm.priorityLevel,
      documentType: docForm.documentType,
      route: finalRoute,
      files: uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
      })),
      history: [
        {
          step: 1,
          department: docForm.originDepartment,
          assignTo: "Unassigned",
          action: "Created",
          date: displayDate,
          daysInDept: 0,
          remarks: "",
        },
      ],
    };

    addDocument(newDocument);
    window.dispatchEvent(new Event("documentsUpdated"));

    resetForm();
    if (onSaved) onSaved(newDocument);
    if (onClose) onClose();
  }

  if (!open) return null;

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(docForm.search.toLowerCase())
  );

  return (
    <div className="adddocs-overlay" onClick={onClose}>
      <div className="adddocs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adddocs-header">
          <div>
            <h2>ADD DOCUMENTS</h2>
            <p className="adddocs-subtitle">
              Enter the document details and upload related files.
            </p>
          </div>

          <div className="adddocs-top-actions">
            <button
              className="adddocs-x"
              onClick={onClose}
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
              placeholder="Search departments for routing"
              value={docForm.search}
              onChange={(e) => handleDocChange("search", e.target.value)}
            />
            <Search className="adddocs-input-icon" size={18} />
          </div>

          <div className="adddocs-input-wrap">
            <input
              className="adddocs-input"
              placeholder="Document Type"
              value={docForm.documentType}
              onChange={(e) => handleDocChange("documentType", e.target.value)}
            />
          </div>

          <div className="adddocs-input-wrap">
            <input
              className="adddocs-input"
              placeholder="Application Name"
              value={docForm.applicationName}
              onChange={(e) =>
                handleDocChange("applicationName", e.target.value)
              }
            />
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
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="adddocs-select-icon" size={18} />
          </div>

          <div className="adddocs-route-box">
            <div className="adddocs-route-title">Routing Checklist</div>

            <div className="adddocs-route-list">
              {filteredDepartments.map((dept) => (
                <label key={dept} className="adddocs-route-item">
                  <input
                    type="checkbox"
                    checked={docForm.route.includes(dept)}
                    onChange={() => handleRouteToggle(dept)}
                    disabled={dept === docForm.originDepartment}
                  />
                  <span>{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="adddocs-selected-route-box">
            <div className="adddocs-route-title">Routing Order</div>

            {docForm.originDepartment && (
              <div className="adddocs-route-chip fixed">
                <span>1. {docForm.originDepartment} (Origin)</span>
              </div>
            )}

            {docForm.route
              .filter((dept) => dept !== docForm.originDepartment)
              .map((dept, index) => (
                <div key={dept} className="adddocs-route-chip">
                  <span>
                    {index + 2}. {dept}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRouteItem(dept)}
                  >
                    ×
                  </button>
                </div>
              ))}

            {!docForm.originDepartment && docForm.route.length === 0 && (
              <div className="adddocs-route-empty">
                Select origin department and routing departments.
              </div>
            )}
          </div>

          <div className="adddocs-row">
            <div className="adddocs-select-wrap">
              <select
                className="adddocs-field"
                value={docForm.priorityLabel}
                onChange={(e) =>
                  handleDocChange("priorityLabel", e.target.value)
                }
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
                onChange={(e) =>
                  handleDocChange("priorityLevel", e.target.value)
                }
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

          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          {uploadedFiles.length > 0 && (
            <div className="uploaded-files-box">
              <div className="uploaded-files-title">
                Uploaded Files ({uploadedFiles.length})
              </div>

              <div className="uploaded-files-list">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="uploaded-file-item"
                  >
                    <div className="uploaded-file-left">
                      <Paperclip size={16} color="#234a91" />
                      <div className="uploaded-file-text">
                        <div className="uploaded-file-name">{file.name}</div>
                        <div className="uploaded-file-size">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="uploaded-file-remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="adddocs-footer">
            <div className="adddocs-left">
              <button
                className="adddocs-small"
                type="button"
                onClick={handleUploadFiles}
              >
                <Upload size={16} />
                <span>Upload Files</span>
              </button>
            </div>

            <div className="adddocs-right">
              <button className="adddocs-save" onClick={handleSaveDoc}>
                Save
              </button>
              <button className="adddocs-cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}