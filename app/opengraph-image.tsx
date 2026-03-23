import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "How to AI Data — Download the full newsletter archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: 28,
            background: "#FF6719",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span
            style={{ color: "white", fontSize: 56, fontWeight: "bold" }}
          >
            AI
          </span>
        </div>

        {/* Title */}
        <span
          style={{
            color: "white",
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          How to AI Data
        </span>

        {/* Subtitle */}
        <span style={{ color: "#999999", fontSize: 28, marginBottom: 60 }}>
          Download the full newsletter archive
        </span>

        {/* Author */}
        <span style={{ color: "#FF6719", fontSize: 22 }}>by Ruben Hassid</span>
      </div>
    ),
    { ...size }
  );
}
