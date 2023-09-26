export const generatePseudoRandomRefetchInterval = () =>
  // Return a refetch interval from 9000 to 15000 milliseconds (approximately 3 to 5 blocks)
  +(Math.random() * 6000 + 9000).toFixed(0);
