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

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── Global opacity ─────────────────────────────────────────────────────────
  const fadeIn = interpolate(frame, [0, fps * 0.35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 1.0, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Glow pulse ─────────────────────────────────────────────────────────────
  const glowCycle = (frame % (fps * 2.5)) / (fps * 2.5);
  const glow = interpolate(glowCycle, [0, 0.5, 1], [0.45, 1, 0.45]);

  // ── Logo spring ────────────────────────────────────────────────────────────
  const logoSpring = spring({
    frame: frame - fps * 0.2,
    fps,
    config: { damping: 230, stiffness: 72 },
    durationInFrames: fps * 1.0,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);
  const logoOp    = interpolate(logoSpring, [0, 1], [0, 1]);

  // ── CTA headline: "Visitanos en la web" ───────────────────────────────────
  const ctaSpring = spring({
    frame: frame - fps * 0.65,
    fps,
    config: { damping: 240, stiffness: 80 },
    durationInFrames: fps * 0.85,
  });
  const ctaY  = interpolate(ctaSpring, [0, 1], [30, 0]);
  const ctaOp = interpolate(ctaSpring, [0, 1], [0, 1]);

  // ── Tagline (subline) ──────────────────────────────────────────────────────
  const tagOp = interpolate(frame, [fps * 1.55, fps * 2.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Separador horizontal animado ──────────────────────────────────────────
  const sepWidth = interpolate(frame, [fps * 0.55, fps * 1.15], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Anillos ────────────────────────────────────────────────────────────────
  const ring1 = spring({ frame: frame - fps * 0.05, fps, config: { damping: 58, stiffness: 40 }, durationInFrames: fps * 2 });
  const ring2 = spring({ frame: frame - fps * 0.22, fps, config: { damping: 58, stiffness: 32 }, durationInFrames: fps * 2 });

  // ── Partículas flotantes ───────────────────────────────────────────────────
  const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
    x: ((i * 137.5) % 1920) - 960,
    y: ((i * 91.3) % 1080) - 540,
    size: 1 + (i % 3) * 0.65,
    delay: i * 2.5,
    driftX: ((i % 5) - 2) * 9,
    driftY: -14 - (i % 7) * 4,
    speed: 0.28 + (i % 5) * 0.07,
  }));
  const particleProgress = interpolate(frame, [0, durationInFrames], [0, 1]);

  // ── "Pill" que aparece con el CTA ─────────────────────────────────────────
  const pillOp = interpolate(frame, [fps * 1.1, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillScale = spring({
    frame: frame - fps * 1.1,
    fps,
    config: { damping: 220, stiffness: 100 },
    durationInFrames: fps * 0.6,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0e",
        opacity: fadeIn * fadeOut,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* ── Fondo radial ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%,
            rgba(237,73,47,${0.24 * glow}) 0%,
            rgba(18,18,26,0.85) 36%,
            rgba(10,10,14,1) 68%)`,
        }}
      />

      {/* ── Grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "68px 68px",
        }}
      />

      {/* ── Glow esquinas ── */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(237,73,47,0.1)",
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: "rgba(237,73,47,0.07)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Partículas flotantes ── */}
      {PARTICLES.map((p, i) => {
        const pOp = interpolate(
          frame,
          [p.delay, p.delay + fps * 0.5, durationInFrames - fps * 0.5],
          [0, 0.5, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const dx = p.driftX * particleProgress;
        const dy = p.driftY * particleProgress * p.speed * 3;
        return (
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
              opacity: pOp,
              transform: `translate(calc(-50% + ${p.x + dx}px), calc(-50% + ${p.y + dy}px))`,
              boxShadow: "0 0 4px rgba(237,73,47,0.8)",
            }}
          />
        );
      })}

      {/* ── Anillos expansivos ── */}
      {[
        { s: ring1, base: 270, opFactor: 0.28 },
        { s: ring2, base: 380, opFactor: 0.18 },
      ].map(({ s, base, opFactor }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: base,
            height: base,
            borderRadius: "50%",
            border: "1px solid rgba(237,73,47,0.55)",
            transform: `translate(-50%, -50%) scale(${s})`,
            opacity: interpolate(s, [0, 0.22, 1], [0, opFactor, 0]),
          }}
        />
      ))}

      {/* ── Anillo estático con breathing glow ── */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: "1px solid rgba(237,73,47,0.22)",
          transform: `translate(-50%, -50%) scale(${ring1})`,
          boxShadow: `0 0 ${52 * glow}px rgba(237,73,47,0.2)`,
        }}
      />

      {/* ── Contenido: titular en el centro vertical de la pantalla ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* Logo + línea arriba del titular (anclados al centro) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, calc(-50% - 168px))`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              opacity: logoOp,
              transform: `scale(${logoScale})`,
              filter: `drop-shadow(0 0 ${36 * glow}px rgba(237,73,47,0.75)) drop-shadow(0 0 80px rgba(237,73,47,0.28))`,
              marginBottom: 20,
            }}
          >
            <Img
              src={staticFile("kondor.png")}
              style={{ width: 200, height: "auto" }}
            />
          </div>
          <div
            style={{
              width: sepWidth,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(237,73,47,0.7), transparent)",
            }}
          />
        </div>

        {/* Titular anclado al centro vertical del frame */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, calc(-50% + ${ctaY}px))`,
            opacity: ctaOp,
            textAlign: "center",
            width: "min(92vw, 1100px)",
            padding: "0 24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 44,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
            }}
          >
            El siguiente nivel empieza{" "}
            <span
              style={{
                color: "#ED492F",
                textShadow: "0 0 36px rgba(237,73,47,0.5)",
              }}
            >
              hoy.
            </span>
          </h2>
        </div>

        {/* Pill CTA justo debajo del titular (mitad inferior del bloque centrado) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(50% + 52px)",
            transform: `translateX(-50%) scale(${0.8 + pillScale * 0.2})`,
            opacity: pillOp,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(237,73,47,0.12)",
            border: "1px solid rgba(237,73,47,0.45)",
            borderRadius: 100,
            padding: "10px 24px",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#ED492F",
              boxShadow: `0 0 ${8 * glow}px rgba(237,73,47,0.9)`,
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Visitá nuestra web
          </span>
          <span style={{ color: "rgba(237,73,47,0.8)", fontSize: 14 }}>→</span>
        </div>

        {/* Tagline al pie */}
        <p
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 44,
            opacity: tagOp,
            margin: 0,
            textAlign: "center",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
          }}
        >
          Ingeniería con criterio
        </p>
      </div>

      {/* ── HUD corners ── */}
      {[
        { top: 36, left: 36 },
        { top: 36, right: 36 },
        { bottom: 36, left: 36 },
        { bottom: 36, right: 36 },
      ].map((pos, i) => {
        const op = interpolate(
          frame,
          [fps * 0.4 + i * 4, fps * 0.9 + i * 4, durationInFrames - fps * 0.6],
          [0, 0.4, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 20,
              height: 20,
              borderTop: "bottom" in pos ? "none" : "1px solid rgba(237,73,47,0.55)",
              borderBottom: "top" in pos ? "none" : "1px solid rgba(237,73,47,0.55)",
              borderLeft: "right" in pos ? "none" : "1px solid rgba(237,73,47,0.55)",
              borderRight: "left" in pos ? "none" : "1px solid rgba(237,73,47,0.55)",
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
