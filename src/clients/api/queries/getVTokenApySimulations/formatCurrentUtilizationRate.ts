import BigNumber from 'bignumber.js';
import { ContractCallResults } from 'ethereum-multicall';

const formatCurrentUtilizationRate = ({
  vTokenBalanceCallResults,
}: {
  vTokenBalanceCallResults: ContractCallResults;
}): number => {
  const result = Object.values(vTokenBalanceCallResults.results)[0].callsReturnContext[200];

  const utilizationRate = new BigNumber(result.returnValues[0].hex).dividedToIntegerBy(
    new BigNumber(10).pow(16),
  );

  return utilizationRate.toNumber();
};

export default formatCurrentUtilizationRate;
