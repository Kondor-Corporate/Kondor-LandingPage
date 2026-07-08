import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

// Radar tick marks
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const deg = i * 15;
  const rad = (deg * Math.PI) / 180;
  const r = 170;
  return {
    deg,
    x: r * Math.sin(rad),
    y: -r * Math.cos(rad),
    isMajor: i % 6 === 0,
    isMid: i % 3 === 0,
  };
});

const BLIPS = [
  { xOff: 40, yOff: -48, cycleFrac: 0.11 },
  { xOff: -50, yOff: 85, cycleFrac: 0.58 },
  { xOff: -70, yOff: -25, cycleFrac: 0.8 },
];

// Alineado con la landing actual
const HEADLINE_LINES = ["Evolución tecnológica", "real, construida con", "ingeniería"];

const STATS = [
  { value: 3, suffix: "+", label: "Productos en desarrollo" },
  { value: 100, suffix: "%", label: "Ingeniería propia" },
  { value: 4, suffix: "", label: "Co-fundadores" },
];

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Duración: 150 frames (5s) — timings comprimidos proporcionalmente
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.4, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const bgOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Radar sweep (5s full rotation)
  const sweepAngle = interpolate(frame, [0, fps * 5], [0, 360], {
    extrapolateRight: "extend",
  });

  // Headline lines — stagger
  const lineAnimations = HEADLINE_LINES.map((_, i) => {
    const start = fps * (0.2 + i * 0.28);
    const y = interpolate(frame, [start, start + fps * 0.4], [36, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(frame, [start, start + fps * 0.4], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { y, opacity };
  });

  // Tag
  const tagOpacity = interpolate(frame, [fps * 0.1, fps * 0.45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle
  const subStart = fps * 1.2;
  const subOpacity = interpolate(frame, [subStart, subStart + fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [subStart, subStart + fps * 0.4], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stats
  const statsOpacity = interpolate(frame, [fps * 1.7, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statsProgress = interpolate(frame, [fps * 1.7, fps * 3.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Radar
  const radarScale = spring({
    frame: frame - fps * 0.5,
    fps,
    config: { damping: 220 },
    durationInFrames: fps * 1.0,
  });
  const radarOpacity = interpolate(frame, [fps * 0.5, fps * 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cycleDuration = fps * 5;
  const cycleFrame = frame % cycleDuration;

  const hudOpacity = interpolate(frame, [fps * 1.4, fps * 1.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1E1E24",
        opacity: bgOpacity * fadeOut,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Background radial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 72% 65%, rgba(237,73,47,0.88) 0%, rgba(180,45,22,0.5) 28%, rgba(30,30,36,1) 58%)",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          opacity: 0.04,
        }}
      />

      {/* Atmospheric glow */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: -60,
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: "rgba(237,73,47,0.12)",
          filter: "blur(100px)",
        }}
      />

      {/* Left — Copy */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          gap: 24,
        }}
      >
        <div style={{ opacity: tagOpacity }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 28,
                height: 1,
                background: "rgba(255,255,255,0.4)",
                display: "inline-block",
              }}
            />
            Software Factory
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {HEADLINE_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                opacity: lineAnimations[i].opacity,
                transform: `translateY(${lineAnimations[i].y}px)`,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 70,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: i === 2 ? "#ED492F" : "white",
                  textShadow:
                    i === 2
                      ? "0 0 50px rgba(237,73,47,0.5)"
                      : undefined,
                }}
              >
                {line}
              </h1>
            </div>
          ))}
        </div>

        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            display: "flex",
            gap: 0,
          }}
        >
          <div
            style={{
              width: 3,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 2,
              marginRight: 18,
              flexShrink: 0,
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: 16,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Impulsa el despegue de tu empresa - ¿Listo para volar?
          </p>
        </div>

        <div
          style={{
            opacity: statsOpacity,
            display: "flex",
            gap: 36,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {STATS.map(({ value, suffix, label }) => {
            const currentVal = Math.round(value * statsProgress);
            return (
              <div
                key={label}
                style={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  {currentVal}
                  {suffix}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — Radar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: radarOpacity,
          transform: `scale(${0.5 + radarScale * 0.5})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 50,
            right: 50,
            display: "flex",
            justifyContent: "space-between",
            opacity: hudOpacity,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              letterSpacing: "0.22em",
              color: "rgba(237,73,47,0.5)",
              textTransform: "uppercase",
            }}
          >
            KONDOR SYS
          </span>
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
            }}
          >
            v2.4.1
          </span>
        </div>

        <div style={{ position: "relative", width: 390, height: 390 }}>
          <div
            style={{
              position: "absolute",
              inset: -50,
              borderRadius: "50%",
              background: "rgba(237,73,47,0.05)",
              filter: "blur(70px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(237,73,47,0.07) 0%, rgba(20,20,28,0.5) 60%, transparent 100%)",
            }}
          />

          {[0.25, 0.5, 0.75, 1].map((s, i) => (
            <div
              key={s}
              style={{
                position: "absolute",
                width: `${s * 100}%`,
                height: `${s * 100}%`,
                top: `${(1 - s) * 50}%`,
                left: `${(1 - s) * 50}%`,
                borderRadius: "50%",
                border: `1px solid rgba(255,255,255,${i === 3 ? 0.1 : 0.04})`,
              }}
            />
          ))}

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 20,
              right: 20,
              height: 1,
              background: "rgba(255,255,255,0.05)",
              transform: "translateY(-50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 20,
              bottom: 20,
              width: 1,
              background: "rgba(255,255,255,0.05)",
              transform: "translateX(-50%)",
            }}
          />

          {TICKS.map(({ deg, x, y, isMajor, isMid }) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                width: 1,
                height: isMajor ? 12 : isMid ? 7 : 3,
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                background: isMajor
                  ? "rgba(237,73,47,0.5)"
                  : "rgba(255,255,255,0.15)",
              }}
            />
          ))}

          {/* Sweep cone */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `conic-gradient(from ${sweepAngle}deg, rgba(237,73,47,0.14) 0deg, rgba(237,73,47,0.03) 50deg, transparent 50deg)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `conic-gradient(from ${sweepAngle}deg, rgba(237,73,47,0.88) 0deg, transparent 2.5deg)`,
            }}
          />

          {/* Blips */}
          {BLIPS.map(({ xOff, yOff, cycleFrac }, i) => {
            const blipFrame = cycleFrame / cycleDuration;
            const diff = Math.abs(blipFrame - cycleFrac);
            const wrapped = Math.min(diff, 1 - diff);
            const blipOpacity =
              wrapped < 0.06 ? interpolate(wrapped, [0, 0.06], [1, 0]) : 0;
            const blipScale =
              wrapped < 0.06
                ? interpolate(wrapped, [0, 0.06], [1.8, 0.5])
                : 0.5;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  top: `calc(50% + ${yOff}px)`,
                  left: `calc(50% + ${xOff}px)`,
                  transform: `translate(-50%, -50%) scale(${blipScale})`,
                  background: "#ED492F",
                  opacity: blipOpacity,
                  boxShadow:
                    "0 0 9px rgba(237,73,47,0.9), 0 0 20px rgba(237,73,47,0.4)",
                }}
              />
            );
          })}

          {/* Center pulse */}
          {(() => {
            const pulseFrac = (frame % (fps * 2)) / (fps * 2);
            const pulseScale = interpolate(pulseFrac, [0, 0.5, 1], [1, 1.7, 1]);
            const pulseOpacity = interpolate(pulseFrac, [0, 0.5, 1], [1, 0.4, 1]);
            return (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#ED492F",
                  transform: `translate(-50%, -50%) scale(${pulseScale})`,
                  opacity: pulseOpacity,
                  boxShadow:
                    "0 0 14px rgba(237,73,47,0.95), 0 0 32px rgba(237,73,47,0.35)",
                }}
              />
            );
          })()}

          {/* Bearing labels */}
          {[
            { label: "000", style: { top: 8, left: "50%", transform: "translateX(-50%)" } },
            { label: "090", style: { top: "50%", right: 8, transform: "translateY(-50%)" } },
            { label: "180", style: { bottom: 8, left: "50%", transform: "translateX(-50%)" } },
            { label: "270", style: { top: "50%", left: 8, transform: "translateY(-50%)" } },
          ].map(({ label, style }) => (
            <span
              key={label}
              style={{
                position: "absolute",
                fontFamily: "monospace",
                fontSize: 8,
                color: "rgba(255,255,255,0.22)",
                letterSpacing: "0.18em",
                ...style,
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* HUD readouts */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 50,
            right: 50,
            display: "flex",
            justifyContent: "space-between",
            opacity: hudOpacity,
          }}
        >
          {[
            { sub: "ALT", val: "3 821 m" },
            { sub: "ZONA DE VUELO", val: "EN LÍNEA" },
            { sub: "VEL", val: "128 km/h" },
          ].map(({ sub, val }) => (
            <div key={sub} style={{ textAlign: "center" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 7,
                  fontFamily: "monospace",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(237,73,47,0.5)",
                }}
              >
                {sub}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 10,
                  fontFamily: "monospace",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {val}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
