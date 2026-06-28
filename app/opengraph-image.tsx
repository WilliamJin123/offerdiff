import { ImageResponse } from "next/og";

export const alt = "OfferDiff — Which job offer is actually better?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b1120 0%, #0f1f1a 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#e2e8f0" }}>
          Offer<span style={{ color: "#10b981" }}>Diff</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              color: "#f8fafc",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Which job offer is
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#f8fafc" }}>actually&nbsp;</span>
            <span style={{ color: "#10b981" }}>better?</span>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#94a3b8" }}>
            Paste two offers → one number, adjusted for commute &amp; cost of living.
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(16,185,129,0.15)",
              border: "2px solid rgba(16,185,129,0.5)",
              borderRadius: 16,
              padding: "16px 28px",
              fontSize: 38,
              fontWeight: 700,
              color: "#34d399",
            }}
          >
            Offer A is worth +$18,240 / year
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
