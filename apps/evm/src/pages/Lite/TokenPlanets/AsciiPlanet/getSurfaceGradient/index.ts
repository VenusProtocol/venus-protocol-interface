import { mixHexColors } from '../../mixHexColors';

export const getSurfaceGradient = ({
  ctx,
  isLight,
  highlight,
  color,
  shadow,
}: {
  ctx: CanvasRenderingContext2D;
  isLight: boolean;
  highlight: string;
  color: string;
  shadow: string;
}) => {
  if (isLight) {
    const gradient = ctx.createRadialGradient(142, 128, 12, 188, 182, 164);
    gradient.addColorStop(0, highlight);
    gradient.addColorStop(0.32, color);
    gradient.addColorStop(0.72, mixHexColors({ from: shadow, to: color, ratio: 0.4 }));
    gradient.addColorStop(1, shadow);
    return gradient;
  }

  const rimAmbient = mixHexColors({ from: shadow, to: color, ratio: 0.3 });
  const gradient = ctx.createLinearGradient(60, 220, 290, 110);
  gradient.addColorStop(0, rimAmbient);
  gradient.addColorStop(0.3, rimAmbient);
  gradient.addColorStop(0.76, color);
  gradient.addColorStop(1, highlight);
  return gradient;
};
