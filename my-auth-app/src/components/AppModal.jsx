import React from "react";

export default function AppModal({
  open,
  title,
  message,
  type = "alert", // "alert" | "confirm"
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="appmodal-overlay" onClick={onCancel}>
      <div className="appmodal-box" onClick={(e) => e.stopPropagation()}>
        <div className="appmodal-header">
          <h3>{title}</h3>
        </div>

        <div className="appmodal-body">
          <p>{message}</p>
        </div>

        <div className="appmodal-actions">
          {type === "confirm" && (
            <button
              type="button"
              className="appmodal-btn appmodal-btn-cancel"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className="appmodal-btn appmodal-btn-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}