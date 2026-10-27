import {
  STILL_STAR_BRIGHTNESS,
  STILL_STAR_COLOR,
  STILL_STAR_COUNT,
  STILL_STAR_SIZE,
  STILL_STAR_VIEWPORT,
} from '../constants';

const stars = Array.from({ length: STILL_STAR_COUNT }, (_, index) => {
  const sample = (salt: number) => {
    const value = Math.sin((index + 1) * salt) * 43758.5453;
    return value - Math.floor(value);
  };

  return {
    x: sample(12.9898) * STILL_STAR_VIEWPORT.width,
    y: sample(78.233) * STILL_STAR_VIEWPORT.height,
    radius: (0.4 + sample(39.425) * 1.1) * STILL_STAR_SIZE,
    opacity: Math.min(1, (0.15 + sample(93.131) * 0.25) * STILL_STAR_BRIGHTNESS),
  };
});

export const StillStars: React.FC = () => (
  <svg
    className="venus-starfield__still"
    viewBox={`0 0 ${STILL_STAR_VIEWPORT.width} ${STILL_STAR_VIEWPORT.height}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <title>Starfield</title>

    {stars.map(star => (
      <circle
        key={`${star.x}-${star.y}`}
        cx={star.x}
        cy={star.y}
        r={star.radius}
        fill={STILL_STAR_COLOR}
        opacity={star.opacity}
      />
    ))}
  </svg>
);
