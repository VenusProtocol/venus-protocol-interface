export type StarTier = 'dust' | 'bright' | 'glint';

export const getStarTier = ({
  index,
  dustCount,
  brightCount,
}: {
  index: number;
  dustCount: number;
  brightCount: number;
}): StarTier => {
  if (index < dustCount) {
    return 'dust';
  }

  if (index < dustCount + brightCount) {
    return 'bright';
  }

  return 'glint';
};
