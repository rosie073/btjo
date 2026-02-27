import React from "react";

/**
 * Desktop shell:
 * - Blue background with circles
 * - White rounded container
 * - Logo top-right
 * - Optional left "Welcome" panel
 */
export default function AuthShell({
  variant = "split", // "split" | "center"
  leftTitle = "Welcome!",
  leftSubtitle = "Documents Tracking System",
  leftDesc = "Monitor document status, improve workflow efficiency,\nand ensure proper handling of office records.",
  logoSrc,
  children,
}) {
  return (
    <div className="page">
      <div className="bg" />

      <div className="frame">
        <div className="frameTopRight">
          <div className="seal">
            {logoSrc ? (
              <img src={logoSrc} alt="Logo" className="sealImg" />
            ) : (
              <div className="sealPlaceholder" title="Logo placeholder" />
            )}
          </div>
        </div>

        {variant === "split" && (
          <div className="leftPanel">
            <div className="leftPanelInner">
              <h1>{leftTitle}</h1>
              <h2>{leftSubtitle}</h2>
              <p style={{ whiteSpace: "pre-line" }}>{leftDesc}</p>
            </div>
          </div>
        )}

        <div className={variant === "split" ? "rightPanel" : "centerPanel"}>
          {children}
        </div>
      </div>
    </div>
  );
}