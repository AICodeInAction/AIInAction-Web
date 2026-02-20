import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI In Action - Learn Vibe Coding by Building";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, #1a1a3e 0%, #0a0a0f 70%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#3B82F6",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            AI In Action
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            maxWidth: "800px",
          }}
        >
          Learn Vibe Coding
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
          }}
        >
          by Building Real Projects
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          100 challenges · 4 paths · Web · Games · Mobile · AI Agents
        </div>
      </div>
    ),
    { ...size }
  );
}
