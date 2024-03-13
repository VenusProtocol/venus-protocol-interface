import type { TokenBalance } from 'types';

const getUniqueTokenBalances = (...tokenBalances: TokenBalance[]) => {
  const uniqueBalancesObj = tokenBalances.reduce<Record<string, TokenBalance>>(
    (acc, tokenBalance) => {
      if (tokenBalance.token.address in acc) {
        return acc;
      }
      return {
        ...acc,
        [tokenBalance.token.address]: tokenBalance,
      };
    },
    {},
  );
  return Object.values(uniqueBalancesObj);
};

export default getUniqueTokenBalances;
