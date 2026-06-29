export interface ResolvePrimeTotalRewardCentsInput {
  apiTotalCents: number;
  marketRewards: { rewardsCents: number }[];
}

export const resolvePrimeTotalRewardCents = ({
  apiTotalCents,
  marketRewards,
}: ResolvePrimeTotalRewardCentsInput): number => {
  const detailTotalCents = marketRewards.reduce(
    (total, { rewardsCents }) => total + rewardsCents,
    0,
  );

  // use the api total if it's greater than 1, otherwise use the detail total, since the API returns 0 for small rewards
  return apiTotalCents >= 1 ? apiTotalCents : detailTotalCents;
};
