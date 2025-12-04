import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "PRISM-7 - Scientific Personality Assessment";
export const size = {
  width: 1200,
  height: 630,
};
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
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.1))",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(249, 115, 22, 0.1))",
            filter: "blur(80px)",
          }}
        />

        {/* PRISM-7 Logo/Text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "48px", color: "white", fontWeight: "bold" }}>P</span>
          </div>
          <span
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PRISM-7
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "36px",
            color: "white",
            fontWeight: "600",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Scientific Personality Assessment
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Discover your authentic self with dimensional insights, not vague categories
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "48px",
          }}
        >
          {["HEXACO+ Model", "85-92% Reliability", "Confidence Intervals"].map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "999px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span style={{ color: "#10b981", fontSize: "20px" }}>✓</span>
              <span style={{ color: "white", fontSize: "18px" }}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}




