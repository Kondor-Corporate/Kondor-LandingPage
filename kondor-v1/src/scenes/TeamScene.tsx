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

// Alineado con TeamSection.jsx (roles y fotos actuales)
const TEAM = [
  {
    id: "K-01",
    name: "Lucas",
    role: "CEO & Co-Fundador",
    bio: "Define el rumbo y apuesta por decisiones que el negocio pueda sostener.",
    img: staticFile("lucas.jpeg"),
  },
  {
    id: "K-02",
    name: "Joaquín",
    role: "COO & Co-Fundador",
    bio: "Convierte la estrategia en ritmo: prioridades claras, ejecución sin humo.",
    img: staticFile("joaco.jfif"),
  },
  {
    id: "K-03",
    name: "Nicolás",
    role: "CTO & Co-Fundador",
    bio: "Arquitectura con dientes: código que escala sin pedir permiso.",
    img: staticFile("nicolas.png"),
  },
  {
    id: "K-04",
    name: "Santiago",
    role: "CMO & Co-Fundador",
    bio: "Hace que el mercado entienda el valor en segundos, no en slides.",
    img: staticFile("santi.jfif"),
  },
];

export const TeamScene: React.FC = () => {
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

  const headerOpacity = interpolate(frame, [fps * 0.15, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [fps * 0.15, fps * 0.6], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardAnimations = TEAM.map((_, i) => {
    const delay = fps * (0.45 + i * 0.15);
    const s = spring({
      frame: frame - delay,
      fps,
      config: { damping: 220, stiffness: 90 },
      durationInFrames: fps * 0.75,
    });
    return {
      y: interpolate(s, [0, 1], [70, 0]),
      opacity: interpolate(s, [0, 1], [0, 1]),
      scale: interpolate(s, [0, 1], [0.92, 1]),
    };
  });

  const overlayReveal = interpolate(frame, [fps * 1.4, fps * 2.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse del dot indicador
  const pulseFrac = (frame % (fps * 2)) / (fps * 2);
  const pulseScale = interpolate(pulseFrac, [0, 0.5, 1], [1, 1.6, 1]);

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

      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 860,
          height: 460,
          borderRadius: "50%",
          background: "rgba(237,73,47,0.05)",
          filter: "blur(120px)",
          transform: "translate(-50%, -50%)",
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
          gap: 40,
        }}
      >
        {/* Header */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
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
                Kondor Team
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
              Cuatro personas,
              <br />
              <span style={{ color: "#ED492F" }}>una dirección.</span>
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 10,
              fontFamily: "monospace",
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              opacity: headerOpacity,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ED492F",
                transform: `scale(${pulseScale})`,
                boxShadow: "0 0 7px rgba(237,73,47,0.8)",
              }}
            />
            4 tripulantes · equipo activo
          </div>
        </div>

        {/* Team grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 16,
          }}
        >
          {TEAM.map(({ id, name, role, bio, img }, i) => {
            const { y, opacity, scale } = cardAnimations[i];
            return (
              <div
                key={id}
                style={{
                  opacity,
                  transform: `translateY(${y}px) scale(${scale})`,
                  position: "relative",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.09)",
                  aspectRatio: "3/4",
                }}
              >
                {/* ID badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 10,
                    fontSize: 8,
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.18em",
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(6px)",
                    borderRadius: 5,
                    padding: "2px 7px",
                  }}
                >
                  {id}
                </div>

                {/* Photo */}
                <Img
                  src={img}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    filter: `grayscale(${interpolate(overlayReveal, [0, 1], [35, 0])}%)`,
                  }}
                />

                {/* Gradient + info overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "50px 16px 16px",
                    background:
                      "linear-gradient(to top, rgba(20,20,28,0.97) 55%, transparent 100%)",
                    opacity: overlayReveal,
                  }}
                >
                  <div
                    style={{
                      width: interpolate(overlayReveal, [0, 1], [0, 20]),
                      height: 1,
                      background: "rgba(237,73,47,0.6)",
                      marginBottom: 8,
                    }}
                  />
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: 17,
                      fontWeight: 900,
                      color: "white",
                      letterSpacing: "-0.01em",
                      lineHeight: 1,
                    }}
                  >
                    {name}
                  </p>
                  <p
                    style={{
                      margin: "0 0 6px",
                      fontSize: 9,
                      fontWeight: 600,
                      color: "rgba(237,73,47,0.8)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    {role}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.5,
                    }}
                  >
                    {bio}
                  </p>
                </div>

                {/* Top accent on hover (static reveal) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, #ED492F, transparent)",
                    opacity: overlayReveal * 0.8,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
