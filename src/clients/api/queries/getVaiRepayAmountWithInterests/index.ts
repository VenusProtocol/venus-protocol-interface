import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { contractInfos } from 'packages/contracts';

import formatToOutput from './formatToOutput';
import { GetVaiRepayAmountWithInterestsInput, GetVaiRepayAmountWithInterestsOutput } from './types';

const getVaiRepayAmountWithInterests = async ({
  multicall3,
  vaiControllerContractAddress,
  accountAddress,
}: GetVaiRepayAmountWithInterestsInput): Promise<GetVaiRepayAmountWithInterestsOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext = {
    reference: 'getVaiRepayTotalAmount',
    contractAddress: vaiControllerContractAddress,
    abi: contractInfos.vaiController.abi,
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

  const contractCallResults: ContractCallResults = await multicall3.call(contractCallContext);

  return formatToOutput({
    contractCallResults,
  });
};

export default getVaiRepayAmountWithInterests;
