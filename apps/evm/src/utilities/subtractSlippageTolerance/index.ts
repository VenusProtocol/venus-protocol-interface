const PERCENTAGE_SCALE = 1_000_000n;

export const subtractSlippageTolerance = ({
  valueMantissa,
  slippageTolerancePercentage,
}: {
  valueMantissa: bigint;
  slippageTolerancePercentage: number;
}) => {
  const keptPercentage = BigInt(Math.round((100 - slippageTolerancePercentage) * 10_000));

  return (valueMantissa * keptPercentage) / PERCENTAGE_SCALE;
};
