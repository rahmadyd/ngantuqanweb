import { ImageResponse } from "next/og";

export default function OgImage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #C2F2E4 0%, #35C8B4 50%, #0C3B35 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(12, 59, 53, 0.9)",
            padding: "48px",
            borderRadius: "24px",
            border: "4px solid #0C3B35",
            boxShadow: "0 20px 40px rgba(12, 59, 53, 0.4)",
            maxWidth: "800px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: "900",
              color: "#FFFFFF",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              textShadow: "4px 4px 0 #0C3B35",
              marginBottom: "16px",
            }}
          >
            Ngantuqan
          </span>
          <p
            style={{
              fontSize: "28px",
              color: "#C2F2E4",
              fontWeight: "500",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            Portofolio visual & toko karya kreatif
          </p>
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                background: "#35C8B4",
                color: "#0C3B35",
                padding: "8px 24px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: "700",
                border: "3px solid #0C3B35",
              }}
            >
              Portofolio
            </span>
            <span
              style={{
                background: "#EDF7BE",
                color: "#0C3B35",
                padding: "8px 24px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: "700",
                border: "3px solid #0C3B35",
              }}
            >
              Toko
            </span>
            <span
              style={{
                background: "#A4CF4A",
                color: "#0C3B35",
                padding: "8px 24px",
                borderRadius: "999px",
                fontSize: "18px",
                fontWeight: "700",
                border: "3px solid #0C3B35",
              }}
            >
              Karya
            </span>
          </div>
          <p
            style={{
              marginTop: "40px",
              fontSize: "20px",
              color: "#EDF7BE",
              fontWeight: "500",
              opacity: 0.9,
            }}
          >
            {baseUrl}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}