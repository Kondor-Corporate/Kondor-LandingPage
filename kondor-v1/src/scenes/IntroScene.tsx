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
  weights: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

// Líneas de luz que cruzan el fondo
const LIGHT_LINES = Array.from({ length: 6 }, (_, i) => ({
  x: 120 + i * 290,
  delay: i * 6,
  width: 1 + (i % 2) * 0.5,
  opacity: 0.06 + (i % 3) * 0.025,
}));

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Fondo ──────────────────────────────────────────────────────────────────
  const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.45, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Glow pulsante del centro ───────────────────────────────────────────────
  const glowCycle = (frame % (fps * 2.4)) / (fps * 2.4);
  const glow = interpolate(glowCycle, [0, 0.5, 1], [0.5, 1, 0.5]);

  // ── Logo: spring de entrada desde abajo ───────────────────────────────────
  const logoSpring = spring({
    frame: frame - fps * 0.3,
    fps,
    config: { damping: 260, stiffness: 70 },
    durationInFrames: fps * 1.1,
  });
  const logoY   = interpolate(logoSpring, [0, 1], [80, 0]);
  const logoOp  = interpolate(logoSpring, [0, 1], [0, 1]);

  // ── Línea separadora bajo el logo ─────────────────────────────────────────
  const lineWidth = interpolate(frame, [fps * 0.8, fps * 1.4], [0, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Anillos expansivos (stagger) ──────────────────────────────────────────
  const rings = [
    spring({ frame: frame - fps * 0.1, fps, config: { damping: 55, stiffness: 38 }, durationInFrames: fps * 2 }),
    spring({ frame: frame - fps * 0.3, fps, config: { damping: 55, stiffness: 30 }, durationInFrames: fps * 2 }),
    spring({ frame: frame - fps * 0.5, fps, config: { damping: 55, stiffness: 24 }, durationInFrames: fps * 2 }),
  ];

  // ── Scan line vertical (entra de arriba a abajo una sola vez) ─────────────
  const scanY = interpolate(frame, [fps * 0.25, fps * 1.6], [-4, 1084], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanOpacity = interpolate(frame, [fps * 0.25, fps * 0.45, fps * 1.4, fps * 1.6], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Partículas orbitales ───────────────────────────────────────────────────
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const r = 130 + (i % 3) * 22;
    const pOp = interpolate(frame, [fps * 0.4 + i * 2, fps * 0.85 + i * 2, durationInFrames - fps * 0.3], [0, 0.6, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const drift = Math.sin((frame * (0.45 + (i % 4) * 0.1) * Math.PI * 2) / fps + i) * 6;
    return { x: Math.cos(angle) * r + drift, y: Math.sin(angle) * r, op: pOp, size: 1.5 + (i % 3) * 0.5 };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0e",
        opacity: bgOpacity * fadeOut,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* ── Fondo radial profundo ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(237,73,47,${0.18 * glow}) 0%,
            rgba(18,18,26,0.85) 38%,
            rgba(10,10,14,1) 70%)`,
        }}
      />

      {/* ── Grid sutil ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Líneas de luz verticales (ambient) ── */}
      {LIGHT_LINES.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: l.x,
            width: l.width,
            background: `linear-gradient(180deg, transparent 0%, rgba(237,73,47,${l.opacity}) 40%, rgba(255,255,255,${l.opacity * 0.6}) 50%, rgba(237,73,47,${l.opacity}) 60%, transparent 100%)`,
          }}
        />
      ))}

      {/* ── Scan line ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY,
          height: 2,
          opacity: scanOpacity,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(237,73,47,0.7) 25%, rgba(255,255,255,0.95) 50%, rgba(237,73,47,0.7) 75%, transparent 100%)",
          boxShadow: "0 0 22px rgba(237,73,47,0.7)",
        }}
      />

      {/* ── Anillos expansivos ── */}
      {rings.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 300 + i * 80,
            height: 300 + i * 80,
            borderRadius: "50%",
            border: "1px solid rgba(237,73,47,0.45)",
            transform: `translate(-50%, -50%) scale(${s})`,
            opacity: interpolate(s, [0, 0.2, 1], [0, 0.5, 0]),
          }}
        />
      ))}

      {/* ── Anillo estático interior (glow breathing) ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: "1px solid rgba(237,73,47,0.3)",
          transform: `translate(-50%, -50%) scale(${rings[0]})`,
          boxShadow: `0 0 ${50 * glow}px rgba(237,73,47,0.18)`,
        }}
      />

      {/* ── Partículas orbitales ── */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#ED492F",
            opacity: p.op,
            transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
            boxShadow: "0 0 5px rgba(237,73,47,0.9)",
          }}
        />
      ))}

      {/* ── Logo + separador ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            opacity: logoOp,
            transform: `translateY(${logoY}px)`,
            filter: `drop-shadow(0 0 ${32 * glow}px rgba(237,73,47,0.72)) drop-shadow(0 0 70px rgba(237,73,47,0.28))`,
          }}
        >
          <Img
            src={staticFile("kondor.png")}
            style={{ width: 240, height: "auto" }}
          />
        </div>

        {/* Línea separadora animada */}
        <div
          style={{
            width: lineWidth,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(237,73,47,0.75), transparent)",
          }}
        />
      </div>

      {/* ── HUD corners ── */}
      {[
        { top: 36, left: 36 },
        { top: 36, right: 36 },
        { bottom: 36, left: 36 },
        { bottom: 36, right: 36 },
      ].map((pos, i) => {
        const op = interpolate(frame, [fps * 0.55 + i * 4, fps * 1.0 + i * 4], [0, 0.45], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 22,
              height: 22,
              borderTop: "bottom" in pos ? "none" : "1px solid rgba(237,73,47,0.6)",
              borderBottom: "top" in pos ? "none" : "1px solid rgba(237,73,47,0.6)",
              borderLeft: "right" in pos ? "none" : "1px solid rgba(237,73,47,0.6)",
              borderRight: "left" in pos ? "none" : "1px solid rgba(237,73,47,0.6)",
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
