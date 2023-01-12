import formatToOutput from './formatToOutput';
import { GetVaiCalculateRepayAmountInput, GetVaiCalculateRepayAmountOutput } from './types';

const getVaiCalculateRepayAmount = async ({
  vaiControllerContract,
  accountAddress,
  repayAmountWei,
}: GetVaiCalculateRepayAmountInput): Promise<GetVaiCalculateRepayAmountOutput> => {
  const response = await vaiControllerContract.methods
    .getVAICalculateRepayAmount(accountAddress, repayAmountWei.toFixed())
    .call();

  return formatToOutput(repayAmountWei, response);
};

export default getVaiCalculateRepayAmount;
