import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { IntroScene } from "./scenes/IntroScene";
import { HeroScene } from "./scenes/HeroScene";
import { AboutScene } from "./scenes/AboutScene";
import { VisionScene } from "./scenes/VisionScene";
import { PortfolioScene } from "./scenes/PortfolioScene";
import { TeamScene } from "./scenes/TeamScene";
import { CTAScene } from "./scenes/CTAScene";
import { OutroScene } from "./scenes/OutroScene";

// Scene durations (frames @ 30fps) — max 5s = 150 frames per scene
const INTRO     = 120; // 4s
const HERO      = 150; // 5s
const ABOUT     = 120; // 4s
const VISION    = 120; // 4s
const PORTFOLIO = 150; // 5s
const TEAM      = 120; // 4s
const CTA       = 120; // 4s
const OUTRO     = 120; // 4s

// Transition duration (frames)
const T = 20;

// Total: 120+150+120+120+150+120+120+120 - 7×20 = 1020 - 140 = 1020
// Actual TransitionSeries total: sum of sequence durations minus overlapping transitions
// = 1020 frames (sequences) - 140 (7 transitions each consuming T frames of overlap)
// = 1020 - 140 = 880 ... but TransitionSeries sums sequences minus transitions
// Correct: TOTAL = INTRO+HERO+ABOUT+VISION+PORTFOLIO+TEAM+CTA+OUTRO - 7*T
export const TOTAL_FRAMES =
  INTRO + HERO + ABOUT + VISION + PORTFOLIO + TEAM + CTA + OUTRO - 7 * T;
// = 120+150+120+120+150+120+120+120 - 140 = 1020 - 140 = 880

const FADE   = fade();
const SLIDE  = slide({ direction: "from-right" });
const WIPE   = wipe({ direction: "from-right" });
const TIMING = linearTiming({ durationInFrames: T });

export const KondorVideo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={INTRO} premountFor={T}>
        <IntroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={SLIDE} timing={TIMING} />

      <TransitionSeries.Sequence durationInFrames={HERO} premountFor={T}>
        <HeroScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={WIPE} timing={TIMING} />

      <TransitionSeries.Sequence durationInFrames={ABOUT} premountFor={T}>
        <AboutScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={FADE} timing={TIMING} />

      <TransitionSeries.Sequence durationInFrames={VISION} premountFor={T}>
        <VisionScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={SLIDE} timing={TIMING} />

      <TransitionSeries.Sequence durationInFrames={PORTFOLIO} premountFor={T}>
        <PortfolioScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={WIPE} timing={TIMING} />

      <TransitionSeries.Sequence durationInFrames={TEAM} premountFor={T}>
        <TeamScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={FADE} timing={TIMING} />

      <TransitionSeries.Sequence durationInFrames={CTA} premountFor={T}>
        <CTAScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={SLIDE} timing={TIMING} />

      <TransitionSeries.Sequence durationInFrames={OUTRO} premountFor={T}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
