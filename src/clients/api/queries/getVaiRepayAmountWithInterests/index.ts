import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { getContractAddress } from 'utilities';

import vaiControllerAbi from 'constants/contracts/abis/vaiController.json';

import formatToOutput from './formatToOutput';
import { GetVaiRepayAmountWithInterestsInput, GetVaiRepayAmountWithInterestsOutput } from './types';

const vaiControllerAddress = getContractAddress('vaiController');

const getVaiCalculateRepayAmount = async ({
  multicall,
  accountAddress,
}: GetVaiRepayAmountWithInterestsInput): Promise<GetVaiRepayAmountWithInterestsOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext = {
    reference: 'getVaiRepayTotalAmount',
    contractAddress: vaiControllerAddress,
    abi: vaiControllerAbi,
    calls: [
      // Call (statically) accrueVAIInterest to calculate past accrued interests
      // before fetching all interests
      { reference: 'accrueVAIInterest', methodName: 'accrueVAIInterest', methodParameters: [] },
      {
        reference: 'getVAIRepayAmount',
        methodName: 'getVAIRepayAmount',
        methodParameters: [accountAddress],
      },
    ],
  };

  const contractCallResults: ContractCallResults = await multicall.call(contractCallContext);

  return formatToOutput({
    contractCallResults,
  });
};

export default getVaiCalculateRepayAmount;
