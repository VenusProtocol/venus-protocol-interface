import BigNumber from 'bignumber.js';
import { ContractCallResults } from 'ethereum-multicall';

import { GetVaiRepayAmountWithInterestsOutput } from './types';

const formatToOutput = ({
  contractCallResults,
}: {
  contractCallResults: ContractCallResults;
}): GetVaiRepayAmountWithInterestsOutput => {
  const [vaiRepayAmountWithInterestsWei] =
    contractCallResults.results.getVaiRepayTotalAmount.callsReturnContext[1].returnValues.map(
      unformattedBigNumber => new BigNumber(unformattedBigNumber.hex),
    );

  return {
    vaiRepayAmountWithInterestsWei,
  };
};

export default formatToOutput;
