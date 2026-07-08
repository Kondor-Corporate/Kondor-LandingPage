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

const ORBS = [
  { angle: 30, r: 380, size: 300, opacity: 0.11, speed: 0.007 },
  { angle: 160, r: 340, size: 240, opacity: 0.09, speed: -0.005 },
  { angle: 280, r: 400, size: 180, opacity: 0.07, speed: 0.004 },
];

export const CTAScene: React.FC = () => {
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

  const tagOpacity = interpolate(frame, [fps * 0.15, fps * 0.55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const h2Spring = spring({
    frame: frame - fps * 0.28,
    fps,
    config: { damping: 220, stiffness: 90 },
    durationInFrames: fps * 0.8,
  });
  const h2Y = interpolate(h2Spring, [0, 1], [44, 0]);
  const h2Opacity = interpolate(h2Spring, [0, 1], [0, 1]);

  const subOpacity = interpolate(frame, [fps * 0.75, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [fps * 0.75, fps * 1.2], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaScale = spring({
    frame: frame - fps * 1.1,
    fps,
    config: { damping: 220, stiffness: 90 },
    durationInFrames: fps * 0.55,
  });
  const ctaOpacity = interpolate(frame, [fps * 1.1, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA glow breathe
  const ctaPulseFrac = (frame % (fps * 2)) / (fps * 2);
  const ctaGlow = interpolate(ctaPulseFrac, [0, 0.5, 1], [0.3, 0.75, 0.3]);

  const noteOpacity = interpolate(frame, [fps * 1.5, fps * 2.0], [0, 1], {
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
            "radial-gradient(ellipse at 72% 65%, rgba(237,73,47,0.88) 0%, rgba(180,45,22,0.5) 28%, rgba(30,30,36,1) 58%)",
        }}
      />

      {/* Orbiting glows */}
      {ORBS.map((orb, i) => {
        const currentAngle =
          ((orb.angle + frame * orb.speed * 180) / Math.PI) * (Math.PI / 180);
        const x = Math.cos(currentAngle) * orb.r;
        const y = Math.sin(currentAngle) * orb.r;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              background: `rgba(237,73,47,${orb.opacity})`,
              filter: "blur(80px)",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Corner accent glows */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "rgba(237,73,47,0.13)",
          filter: "blur(90px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -90,
          left: -90,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(237,73,47,0.09)",
          filter: "blur(80px)",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.033,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 200px",
          textAlign: "center",
          gap: 0,
        }}
      >
        {/* Tag */}
        <div
          style={{
            opacity: tagOpacity,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ width: 22, height: 1, background: "rgba(237,73,47,0.8)" }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#ED492F",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Conversemos
          </span>
          <div style={{ width: 22, height: 1, background: "rgba(237,73,47,0.8)" }} />
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: h2Opacity,
            transform: `translateY(${h2Y}px)`,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 68,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            Construyamos el sistema que
            <br />
            tu organización{" "}
            <span
              style={{
                color: "#ED492F",
                textShadow: "0 0 38px rgba(237,73,47,0.45)",
              }}
            >
              necesita
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            margin: "0 0 36px",
            fontSize: 17,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.65,
            maxWidth: 580,
          }}
        >
          Somos cuatro personas con criterio técnico y visión clara. Sin
          presentaciones largas: hablemos sobre lo que podemos construir juntos.
        </p>

        {/* CTA button */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `scale(${0.75 + ctaScale * 0.25})`,
            marginBottom: 28,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#ED492F",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              padding: "14px 36px",
              borderRadius: 18,
              boxShadow: `0 0 ${56 * ctaGlow}px rgba(237,73,47,0.5), 0 8px 28px rgba(237,73,47,0.35)`,
            }}
          >
            Solicitar una conversación
            <span style={{ fontSize: 17 }}>→</span>
          </div>
        </div>

        {/* Note */}
        <p
          style={{
            opacity: noteOpacity,
            margin: 0,
            fontSize: 11,
            color: "rgba(255,255,255,0.32)",
          }}
        >
          Sin compromisos. Sin presentaciones largas. Solo una conversación honesta.
        </p>
      </div>
    </AbsoluteFill>
  );
};
