import React from "react";

export default function TextField({
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  disabled,
}) {
  return (
    <div className="field">
      <label className="label">
        {label} {required && <span className="req">*</span>}
      </label>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}