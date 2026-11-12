import { useEffect, useRef } from 'react';

const METEOR_COUNT = 3;
const STREAK_MS = 1080;
const GAP_MS = 9000;

export const Meteors: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const meteors = [...host.querySelectorAll<HTMLElement>('.venus-starfield__meteor')];
    let index = 0;
    let streakTimer = 0;
    let gapTimer = 0;

    const streak = () => {
      const meteor = meteors[index % meteors.length];
      index += 1;

      if (document.hasFocus() && !document.hidden) {
        meteor.dataset.streaking = '';
        streakTimer = window.setTimeout(() => {
          delete meteor.dataset.streaking;
        }, STREAK_MS);
      }

      gapTimer = window.setTimeout(streak, GAP_MS / meteors.length);
    };

    gapTimer = window.setTimeout(streak, GAP_MS / meteors.length);

    return () => {
      window.clearTimeout(streakTimer);
      window.clearTimeout(gapTimer);
      meteors.forEach(meteor => {
        delete meteor.dataset.streaking;
      });
    };
  }, []);

  return (
    <div ref={hostRef} className="venus-starfield__meteors">
      {Array.from({ length: METEOR_COUNT }, (_, meteor) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: decorative, fixed-length list
        <span key={meteor} className="venus-starfield__meteor" />
      ))}
    </div>
  );
};
