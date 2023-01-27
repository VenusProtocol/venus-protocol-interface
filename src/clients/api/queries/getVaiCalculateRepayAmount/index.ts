import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { getContractAddress } from 'utilities';

import vaiControllerAbi from 'constants/contracts/abis/vaiController.json';

import formatToOutput from './formatToOutput';
import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

const vaiControllerAddress = getContractAddress('vaiController');

const getVaiCalculateRepayAmount = async ({
  multicall,
  accountAddress,
  repayAmountWei,
}: GetVaiCalculateRepayAmountInput): Promise<GetVaiCalculateRepayAmountOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext = {
    reference: 'getVaiRepayInterests',
    contractAddress: vaiControllerAddress,
    abi: vaiControllerAbi,
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
