import { Prime, ResilientOracle } from 'packages/contracts';

const formatToPrimePendingRewardGroup = ({
  primeVTokenAddresses,
  primeVTokenUnderlyingPrices,
  primePendingRewardAmounts,
}: {
  primeVTokenAddresses: string[];
  primeVTokenUnderlyingPrices: Awaited<
    ReturnType<ResilientOracle['getUnderlyingPrice']> | undefined
  >[];
  primePendingRewardAmounts?: Awaited<
    ReturnType<Prime['callStatic']['claimInterest(address,address)']> | undefined
  >[];
}) => {};

export default formatToPrimePendingRewardGroup;
