import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

// Copy alineado con la landing actual (AboutSection.jsx)
const CARDS = [
  {
    icon: "◎",
    title: "Quiénes somos",
    body: "Una software factory que diseña y construye sistemas digitales para la evolución tecnológica de empresas en crecimiento.",
    accent: false,
  },
  {
    icon: "⚡",
    title: "Cómo trabajamos",
    body: "Visión de producto, criterio técnico y buenas prácticas de ingeniería para construir soluciones claras, seguras y escalables.",
    accent: true,
  },
  {
    icon: "◎",
    title: "Qué buscamos",
    body: "Ayudamos a organizaciones pequeñas y medianas a operar con más estructura, visibilidad y capacidad de crecimiento.",
    accent: false,
  },
];

export const AboutScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Duración: 120 frames (4s)
  const fadeIn = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.4, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerY = interpolate(frame, [fps * 0.15, fps * 0.65], [36, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerOpacity = interpolate(frame, [fps * 0.15, fps * 0.65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardAnimations = CARDS.map((_, i) => {
    const delay = fps * (0.55 + i * 0.18);
    const s = spring({
      frame: frame - delay,
      fps,
      config: { damping: 220, stiffness: 90 },
      durationInFrames: fps * 0.7,
    });
    return {
      y: interpolate(s, [0, 1], [50, 0]),
      opacity: interpolate(s, [0, 1], [0, 1]),
    };
  });

  const accentLineWidth = interpolate(frame, [fps * 0.9, fps * 1.5], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1E1E24",
        opacity: fadeIn * fadeOut,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 72% 65%, rgba(237,73,47,0.85) 0%, rgba(180,45,22,0.5) 28%, rgba(30,30,36,1) 58%)",
        }}
      />

      {/* Top edge line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 120px",
        }}
      >
        {/* Section header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            marginBottom: 52,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div style={{ width: 28, height: 1, background: "rgba(237,73,47,0.7)" }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#ED492F",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Nuestra identidad
            </span>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 50,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Construimos con criterio,
            <br />
            <span style={{ color: "#ED492F" }}>no por improvisación.</span>
          </h2>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {CARDS.map(({ title, body, accent }, i) => {
            const { y, opacity } = cardAnimations[i];
            return (
              <div
                key={title}
                style={{
                  opacity,
                  transform: `translateY(${y}px)`,
                  position: "relative",
                  borderRadius: 20,
                  border: accent
                    ? "1px solid rgba(237,73,47,0.35)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: accent
                    ? "rgba(237,73,47,0.08)"
                    : "rgba(255,255,255,0.05)",
                  padding: "30px 28px",
                  overflow: "hidden",
                }}
              >
                {/* Accent top line (animated) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: 2,
                    width: accent ? `${accentLineWidth}%` : "0%",
                    background:
                      "linear-gradient(90deg, rgba(237,73,47,0.4), #ED492F, rgba(237,73,47,0.4))",
                  }}
                />

                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: accent
                      ? "rgba(237,73,47,0.18)"
                      : "rgba(255,255,255,0.07)",
                    border: accent
                      ? "1px solid rgba(237,73,47,0.3)"
                      : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    fontSize: 18,
                    color: accent ? "#ED492F" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {i === 1 ? "⚡" : i === 0 ? "◎" : "⊙"}
                </div>

                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.65,
                  }}
                >
                  {body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
