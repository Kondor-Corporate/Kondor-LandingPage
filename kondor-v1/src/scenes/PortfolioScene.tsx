import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

// Clientes reales de la landing (PortfolioSection.jsx)
const CLIENTS = [
  {
    name: "Maps organización",
    logo: staticFile("portfolio/maps.png"),
    tagline: "Partnership en plataforma",
    status: "En producción",
    statusBg: "rgba(16,185,129,0.12)",
    statusBorder: "rgba(52,211,153,0.25)",
    statusColor: "rgba(167,243,208,0.95)",
  },
  {
    name: "Club de campo La Federala",
    logo: staticFile("portfolio/IconoLF.png"),
    tagline: "Comercialización y control",
    status: "En producción",
    statusBg: "rgba(16,185,129,0.12)",
    statusBorder: "rgba(52,211,153,0.25)",
    statusColor: "rgba(167,243,208,0.95)",
    highlight: true,
  },
  {
    name: "Club For Ever",
    logo: staticFile("portfolio/forever.png"),
    tagline: "Pagos y gestión",
    status: "En producción",
    statusBg: "rgba(16,185,129,0.12)",
    statusBorder: "rgba(52,211,153,0.25)",
    statusColor: "rgba(167,243,208,0.95)",
  },
];

const LAB = [
  { name: "TakeOff — Planificar tu viaje ya no será un problema", status: "Próximamente", color: "rgba(186,230,253,0.95)" },
];

export const PortfolioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Duración: 150 frames (5s)
  const fadeIn = interpolate(frame, [0, fps * 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.4, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const headerOpacity = interpolate(frame, [fps * 0.15, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [fps * 0.15, fps * 0.6], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const clientAnimations = CLIENTS.map((_, i) => {
    const delay = fps * (0.5 + i * 0.25);
    const s = spring({
      frame: frame - delay,
      fps,
      config: { damping: 220, stiffness: 90 },
      durationInFrames: fps * 0.65,
    });
    return {
      scale: interpolate(s, [0, 1], [0.7, 1]),
      opacity: interpolate(s, [0, 1], [0, 1]),
    };
  });

  const labOpacity = interpolate(frame, [fps * 1.5, fps * 2.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Active" product cycles every ~1.5s para animar highlight
  const activeIndex = Math.min(
    Math.floor(interpolate(frame, [fps * 0.5, fps * 4.5], [0, 3], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
    2
  );

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

      {/* Top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(237,73,47,0.35), transparent)",
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
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{ width: 28, height: 1, background: "rgba(255,255,255,0.4)" }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Portfolio
            </span>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 50,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Clientes reales,
            <br />
            <span style={{ color: "#ED492F" }}>sistemas en producción.</span>
          </h2>
        </div>

        {/* Client cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 18,
            marginBottom: 24,
          }}
        >
          {CLIENTS.map((client, i) => {
            const { scale, opacity } = clientAnimations[i];
            const isActive = activeIndex === i;
            return (
              <div
                key={client.name}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  position: "relative",
                  borderRadius: 18,
                  border: isActive
                    ? "1px solid rgba(237,73,47,0.55)"
                    : client.highlight
                    ? "1px solid rgba(237,73,47,0.25)"
                    : "1px solid rgba(255,255,255,0.1)",
                  background: isActive
                    ? "rgba(237,73,47,0.1)"
                    : "rgba(255,255,255,0.04)",
                  padding: "24px 20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 10,
                  boxShadow: isActive ? "0 0 36px rgba(237,73,47,0.14)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {client.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 16,
                      right: 16,
                      height: 2,
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg, transparent, #ED492F, transparent)",
                      opacity: 0.8,
                    }}
                  />
                )}

                {/* Logo */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 14,
                    border: isActive
                      ? "1px solid rgba(237,73,47,0.3)"
                      : "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Img
                    src={client.logo}
                    style={{ width: "80%", height: "80%", objectFit: "contain" }}
                  />
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {client.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {client.tagline}
                </p>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "3px 9px",
                    borderRadius: 7,
                    background: client.statusBg,
                    border: `1px solid ${client.statusBorder}`,
                    color: client.statusColor,
                  }}
                >
                  {client.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Lab projects */}
        <div
          style={{
            opacity: labOpacity,
            display: "flex",
            gap: 16,
          }}
        >
          {LAB.map((lab) => (
            <div
              key={lab.name}
              style={{
                flex: 1,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {lab.name}
              </p>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: lab.color,
                }}
              >
                {lab.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
