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
        <svg width="104" height="92" viewBox="0 0 104 92" xmlns="http://www.w3.org/2000/svg">
          <path d="M52 6 L98 86 H6 Z" fill="#f1eee7" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
