import { MutationObserverOptions, useMutation } from 'react-query';

import { borrowVToken, IBorrowVTokenInput, BorrowVTokenOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { VTokenId } from 'types';
import { useVTokenContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  BorrowVTokenOutput,
  Error,
  Omit<IBorrowVTokenInput, 'vTokenContract'>
>;

const useBorrowVToken = ({ vTokenId }: { vTokenId: VTokenId }, options?: Options) => {
  const vTokenContract = useVTokenContract(vTokenId);

  // @TODO: invalidate queries related to fetching borrow balance
  return useMutation(
    FunctionKey.BORROW_V_TOKEN,
    params =>
      borrowVToken({
        vTokenContract,
        ...params,
      }),
    options,
  );
};

export default useBorrowVToken;
