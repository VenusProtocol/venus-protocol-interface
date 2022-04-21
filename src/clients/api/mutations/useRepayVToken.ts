import { MutationObserverOptions } from 'react-query';

import { VTokenId } from 'types';
import {
  useRepayNonBnbVToken,
  useRepayBnb,
  RepayBnbOutput,
  RepayNonBnbVTokenOutput,
  IRepayNonBnbVTokenInput,
  IRepayBnbInput,
} from 'clients/api';

type Options = MutationObserverOptions<
  RepayBnbOutput | RepayNonBnbVTokenOutput,
  Error,
  Omit<IRepayNonBnbVTokenInput, 'vTokenContract'> | Omit<IRepayBnbInput, 'web3'>
>;

const useRepayVToken = ({ vTokenId }: { vTokenId: VTokenId }, options?: Options) => {
  const useRepayNonBnbVTokenResult = useRepayNonBnbVToken(
    { vTokenId: vTokenId as Exclude<VTokenId, 'bnb'> },
    options,
  );
  const useRepayBnbResult = useRepayBnb(options);

  return vTokenId === 'bnb' ? useRepayBnbResult : useRepayNonBnbVTokenResult;
};

export default useRepayVToken;
