import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { uniqueContractInfos } from 'packages/contracts';

import formatToOutput from './formatToOutput';
import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

const getVaiCalculateRepayAmount = async ({
  multicall,
  vaiControllerContractAddress,
  accountAddress,
  repayAmountWei,
}: GetVaiCalculateRepayAmountInput): Promise<GetVaiCalculateRepayAmountOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext = {
    reference: 'getVaiRepayInterests',
    contractAddress: vaiControllerContractAddress,
    abi: uniqueContractInfos.vaiController.abi,
    calls: [
      // Call (statically) accrueVAIInterest to calculate past accrued interests
      // before fetching all interests
      { reference: 'accrueVAIInterest', methodName: 'accrueVAIInterest', methodParameters: [] },
      {
        reference: 'getVAICalculateRepayAmount',
        methodName: 'getVAICalculateRepayAmount',
        methodParameters: [accountAddress, repayAmountWei.toFixed()],
      },
    ],
  };

  const contractCallResults: ContractCallResults = await multicall.call(contractCallContext);

  return formatToOutput({
    repayAmountWei,
    contractCallResults,
  });
};

export default getVaiCalculateRepayAmount;
