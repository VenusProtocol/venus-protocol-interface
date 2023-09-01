import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { contractInfos } from 'packages/contracts';

import formatToOutput from './formatToOutput';
import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

const getVaiCalculateRepayAmount = async ({
  multicall3,
  vaiControllerContractAddress,
  accountAddress,
  repayAmountWei,
}: GetVaiCalculateRepayAmountInput): Promise<GetVaiCalculateRepayAmountOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext = {
    reference: 'getVaiRepayInterests',
    contractAddress: vaiControllerContractAddress,
    abi: contractInfos.vaiController.abi,
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

  const contractCallResults: ContractCallResults = await multicall3.call(contractCallContext);

  return formatToOutput({
    repayAmountWei,
    contractCallResults,
  });
};

export default getVaiCalculateRepayAmount;
