import { MutationObserverOptions, useMutation } from 'react-query';

import { useWeb3 } from 'clients/web3';
import { repayBnb, IRepayBnbInput, RepayBnbOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<RepayBnbOutput, Error, Omit<IRepayBnbInput, 'web3'>>;

const useRepayNonBnbVToken = (options?: Options) => {
  const web3 = useWeb3();

  // @TODO: invalidate queries related to fetching borrow balance
  return useMutation(
    FunctionKey.REPAY_BNB,
    params =>
      repayBnb({
        web3,
        ...params,
      }),
    options,
  );
};

export default useRepayNonBnbVToken;
