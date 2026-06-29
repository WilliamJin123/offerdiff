import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f6b43",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 0,
            height: 0,
            borderLeft: "48px solid transparent",
            borderRight: "48px solid transparent",
            borderBottom: "84px solid #f1eee7",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
