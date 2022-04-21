import { MutationObserverOptions, useMutation } from 'react-query';

import { repayNonBnbVToken, IRepayNonBnbVTokenInput, RepayBnbOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';
import { useVTokenContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  RepayBnbOutput,
  Error,
  Omit<IRepayNonBnbVTokenInput, 'vTokenContract'>
>;

const useRepayNonBnbVToken = (
  { vTokenId }: { vTokenId: Exclude<VTokenId, 'bnb'> },
  options?: Options,
) => {
  const vTokenContract = useVTokenContract(vTokenId);

  // @TODO: invalidate queries related to fetching borrow balance
  return useMutation(
    FunctionKey.REPAY_NON_BNB,
    params =>
      repayNonBnbVToken({
        vTokenContract,
        ...params,
      }),
    options,
  );
};

export default useRepayNonBnbVToken;
