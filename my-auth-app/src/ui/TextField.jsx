import React from "react";

export default function TextField({
  label,
  required = false,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  autoComplete,
}) {
  return (
    <div className="field">
      {label !== undefined && label !== null && label !== "" && (
        <div className="label">
          {label} {required && <span className="req">*</span>}
        </div>
      )}

      <input
        className="input"
        type={type}
        name={name}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}