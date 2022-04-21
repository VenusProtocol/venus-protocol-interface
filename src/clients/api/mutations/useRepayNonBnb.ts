import { MutationObserverOptions, useMutation } from 'react-query';

import { repayNonBnb, IRepayNonBnbInput, RepayBnbOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';
import { useVTokenContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  RepayBnbOutput,
  Error,
  Omit<IRepayNonBnbInput, 'vTokenContract'>
>;

const useRepayNonBnb = (
  { vTokenId }: { vTokenId: Exclude<VTokenId, 'bnb'> },
  options?: Options,
) => {
  const vTokenContract = useVTokenContract(vTokenId);

  // @TODO: invalidate queries related to fetching borrow balance
  return useMutation(
    FunctionKey.REPAY_NON_BNB,
    params =>
      repayNonBnb({
        vTokenContract,
        ...params,
      }),
    options,
  );
};

export default useRepayNonBnb;
