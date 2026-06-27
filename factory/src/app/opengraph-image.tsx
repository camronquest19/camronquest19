import { ImageResponse } from "next/og";
import { BRAND } from "@/config/brand";

export const alt = `${BRAND.name} — ${BRAND.tagline}`;
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
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1f5af0 0%, #152352 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "white",
              color: "#1f5af0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 900,
            }}
          >
            L
          </div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>{BRAND.name}</div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
          {BRAND.tagline}
        </div>
        <div style={{ fontSize: 30, marginTop: 28, opacity: 0.9, maxWidth: 900 }}>
          Websites + buy button + automation for local business — done for you.
        </div>
      </div>
    ),
    size,
  );
}
