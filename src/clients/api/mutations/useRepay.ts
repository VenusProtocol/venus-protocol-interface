import { MutationObserverOptions } from 'react-query';

import { VTokenId } from 'types';
import {
  useRepayNonBnb,
  useRepayBnb,
  RepayBnbOutput,
  RepayNonBnbOutput,
  IRepayNonBnbInput,
  IRepayBnbInput,
} from 'clients/api';

type Options = MutationObserverOptions<
  RepayBnbOutput | RepayNonBnbOutput,
  Error,
  Omit<IRepayNonBnbInput, 'vTokenContract'> | Omit<IRepayBnbInput, 'web3'>
>;

const useRepay = ({ tokenId }: { tokenId: VTokenId }, options?: Options) => {
  const useRepayNonBnbResult = useRepayNonBnb(
    { tokenId: tokenId as Exclude<VTokenId, 'bnb'> },
    options,
  );
  const useRepayBnbResult = useRepayBnb(options);

  return tokenId === 'bnb' ? useRepayBnbResult : useRepayNonBnbResult;
};

export default useRepay;
