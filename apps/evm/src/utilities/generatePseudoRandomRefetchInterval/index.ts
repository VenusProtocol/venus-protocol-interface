export const generatePseudoRandomRefetchInterval = (speed?: 'FAST' | 'MODERATE') => {
  if (speed === 'FAST') {
    // Return a refetch interval from 3000 to 6000 milliseconds
    return +(Math.random() * 3000 + 3000).toFixed(0);
  }
  if (speed === 'MODERATE') {
    // Return a refetch interval from 6000 to 9000 milliseconds
    return +(Math.random() * 6000 + 3000).toFixed(0);
  }
  // Return a refetch interval from 9000 to 15000 milliseconds (approximately 3 to 5 blocks)
  return +(Math.random() * 6000 + 9000).toFixed(0);
};
