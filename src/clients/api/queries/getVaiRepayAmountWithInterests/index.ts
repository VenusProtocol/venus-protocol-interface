import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { uniqueContractInfos } from 'packages/contracts';

import formatToOutput from './formatToOutput';
import { GetVaiRepayAmountWithInterestsInput, GetVaiRepayAmountWithInterestsOutput } from './types';

const getVaiRepayAmountWithInterests = async ({
  multicall,
  vaiControllerContractAddress,
  accountAddress,
}: GetVaiRepayAmountWithInterestsInput): Promise<GetVaiRepayAmountWithInterestsOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext = {
    reference: 'getVaiRepayTotalAmount',
    contractAddress: vaiControllerContractAddress,
    abi: uniqueContractInfos.vaiController.abi,
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

export default getVaiRepayAmountWithInterests;
