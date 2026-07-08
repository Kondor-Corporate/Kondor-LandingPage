import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "400", "600", "700", "900"],
  subsets: ["latin"],
});

// Alineado con VisionSection.jsx — pilares sin body text
const PILLARS = [
  { title: "Ingeniería de criterio", n: "01" },
  { title: "Arquitectura escalable", n: "02" },
  { title: "Evolución continua", n: "03" },
  { title: "Ecosistema integrado", n: "04" },
];

export const VisionScene: React.FC = () => {
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

  const headerOpacity = interpolate(frame, [fps * 0.15, fps * 0.65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [fps * 0.15, fps * 0.65], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subOpacity = interpolate(frame, [fps * 0.5, fps * 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pillarAnimations = PILLARS.map((_, i) => {
    const delay = fps * (0.65 + i * 0.18);
    const s = spring({
      frame: frame - delay,
      fps,
      config: { damping: 220, stiffness: 90 },
      durationInFrames: fps * 0.7,
    });
    return {
      y: interpolate(s, [0, 1], [40, 0]),
      opacity: interpolate(s, [0, 1], [0, 1]),
    };
  });

  // Linea accent inferior animada
  const accentLineWidth = interpolate(frame, [fps * 0.4, fps * 1.2], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Underline de "rigor" que se revela
  const underlineScale = interpolate(frame, [fps * 0.55, fps * 1.1], [0, 1], {
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
      {/* Background glass blur */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 72% 65%, rgba(237,73,47,0.85) 0%, rgba(180,45,22,0.5) 28%, rgba(30,30,36,1) 58%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(237,73,47,0.04) 0%, transparent 50%)",
        }}
      />

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: `${accentLineWidth}%`,
          background:
            "linear-gradient(90deg, transparent, rgba(237,73,47,0.45), transparent)",
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
        {/* Header row */}
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 56,
            gap: 40,
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
              <div style={{ width: 28, height: 1, background: "#ED492F" }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ED492F",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                Nuestra visión
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 56,
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Tecnología real,
                <br />
                construida con{" "}
                <span style={{ color: "#ED492F", position: "relative" }}>
                  rigor
                </span>
                .
              </h2>
              {/* Underline animado bajo "rigor" */}
              <div
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 12,
                  width: 88,
                  height: 2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(90deg, rgba(237,73,47,0.2), #ED492F, rgba(237,73,47,0.2))",
                  transformOrigin: "left",
                  transform: `scaleX(${underlineScale})`,
                }}
              />
            </div>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              maxWidth: 340,
              textAlign: "right",
              opacity: subOpacity,
              borderRight: "3px solid rgba(255,255,255,0.13)",
              paddingRight: 20,
            }}
          >
            Diseñamos sistemas para que empresas en crecimiento operen con la
            claridad y disciplina tecnológica de organizaciones mucho más grandes.
          </p>
        </div>

        {/* Pilares — diseño dinámico (logo + número + título sin body) */}
        <div
          style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 20,
          }}
        >
          {PILLARS.map(({ title, n }, i) => {
            const { y, opacity } = pillarAnimations[i];
            return (
              <div
                key={title}
                style={{
                  opacity,
                  transform: `translateY(${y}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  borderLeft: "1px solid rgba(255,255,255,0.12)",
                  paddingLeft: 20,
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                {/* Icon orbit */}
                <div
                  style={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "1px solid rgba(237,73,47,0.4)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: "5px",
                      borderRadius: "50%",
                      border: "1px dashed rgba(237,73,47,0.2)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: "8px",
                      borderRadius: "50%",
                      background: "rgba(237,73,47,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontFamily: "monospace",
                      fontSize: 10,
                      color: "rgba(237,73,47,0.8)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {n}
                  </p>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: "white",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
