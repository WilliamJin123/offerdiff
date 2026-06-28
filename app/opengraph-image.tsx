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
          background: "#efece4",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#1a1813" }}>
            Offer<span style={{ color: "#0f6b43" }}>Diff</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#8a8576",
            }}
          >
            Free · instant · no signup
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 82,
              fontWeight: 700,
              color: "#1a1813",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Which job offer is&nbsp;
            <span style={{ color: "#0f6b43", fontStyle: "italic" }}>actually</span>
            &nbsp;better?
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, color: "#57534a" }}>
            One honest number, after rent, commute &amp; cost of living.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 18,
              border: "2px solid #c4bdab",
              background: "#f8f6f0",
              padding: "20px 30px",
            }}
          >
            <span style={{ display: "flex", fontSize: 26, color: "#57534a" }}>Offer A leaves you</span>
            <span style={{ display: "flex", fontSize: 46, fontWeight: 700, color: "#0f6b43" }}>
              +$18,240/yr
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
