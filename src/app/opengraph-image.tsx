import { ImageResponse } from "next/og";
import { siteConfig } from "@portfolio/config";

export const alt = siteConfig.name;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Subtle accent border at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#5b9cf6",
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ebebeb",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {siteConfig.author.name}
        </div>

        {/* Job title */}
        <div
          style={{
            fontSize: 32,
            color: "#5b9cf6",
            fontWeight: 500,
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          {siteConfig.author.jobTitle}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "2px",
            background: "#1f1f1f",
            marginBottom: "32px",
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.5,
          }}
        >
          {siteConfig.description}
        </div>

        {/* Subtle accent border at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#5b9cf6",
            opacity: 0.3,
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
