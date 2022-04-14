import { MutationObserverOptions, useMutation } from 'react-query';

import { repayVai, IRepayVaiInput, IRepayVaiOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  IRepayVaiOutput,
  Error,
  Omit<IRepayVaiInput, 'vaiControllerContract'>
>;

const useRepayVai = (options?: Options) => {
  const vaiControllerContract = useVaiUnitrollerContract();

  // @TODO: invalidate queries related to fetching the user VAI balance and
  // minted VAI amount on success (see https://app.clickup.com/t/26b1p53)
  return useMutation(
    FunctionKey.REPAY_VAI,
    (params: Omit<IRepayVaiInput, 'vaiControllerContract'>) =>
      repayVai({
        vaiControllerContract,
        ...params,
      }),
    options,
  );
};

export default useRepayVai;
