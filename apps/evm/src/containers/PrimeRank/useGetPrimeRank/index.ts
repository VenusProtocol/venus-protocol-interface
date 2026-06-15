export interface PrimeRankData {
  hasStakedXvs: boolean;
  isCandidate: boolean;
  isPrime: boolean;
  hasSupplied: boolean;
  rank: number;
  primeScore: number;
  gapXvsTokens: number;
}

// TODO: replace this placeholder with the rank data returned by the API
const placeholderRankData: PrimeRankData = {
  hasStakedXvs: true,
  isCandidate: true,
  isPrime: true,
  hasSupplied: true,
  rank: 2,
  primeScore: 542_500_000,
  gapXvsTokens: 5_432,
};

export const useGetPrimeRank = (): PrimeRankData => placeholderRankData;
