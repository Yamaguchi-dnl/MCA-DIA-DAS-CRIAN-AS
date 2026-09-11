import { ImageResponse } from "next/og";
import { eventoConfig } from "@/config/evento";

export const runtime = "edge";
export const alt = eventoConfig.nomeEvento;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#E84118",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            background: "#FFD000",
            color: "#4A2E22",
            padding: "10px 28px",
            borderRadius: 999,
          }}
        >
          🎪 EVENTO GRATUITO
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          {eventoConfig.nomeEvento}
        </div>
        <div style={{ marginTop: 20, fontSize: 36, fontWeight: 600 }}>
          {eventoConfig.subtitulo}
        </div>
        <div style={{ marginTop: 28, fontSize: 32, opacity: 0.95 }}>
          {eventoConfig.dataEventoExibicao} · {eventoConfig.horario}
        </div>
        <div style={{ marginTop: 8, fontSize: 28, opacity: 0.85 }}>
          {eventoConfig.local} — {eventoConfig.endereco}
        </div>
      </div>
    ),
    { ...size },
  );
}
