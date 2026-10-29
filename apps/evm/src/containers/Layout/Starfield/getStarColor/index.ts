import { STAR_FIELD } from '../constants';
import type { StarTier } from '../getStarTier';

export const getStarColor = ({
  tier,
  isWarm,
  blueSeed,
}: {
  tier: StarTier;
  isWarm: boolean;
  blueSeed: number;
}) => {
  const { colors } = STAR_FIELD;

  if (isWarm) {
    return tier === 'bright' ? colors.warmBright : colors.warmDust;
  }

  if (tier !== 'dust') {
    return colors.bright;
  }

  return blueSeed < colors.blueDustShare ? colors.blueDust : colors.dust;
};
