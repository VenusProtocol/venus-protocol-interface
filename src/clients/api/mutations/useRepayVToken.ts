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

const useRepayVToken = ({ vTokenId }: { vTokenId: VTokenId }, options?: Options) => {
  const useRepayNonBnbResult = useRepayNonBnb(
    { vTokenId: vTokenId as Exclude<VTokenId, 'bnb'> },
    options,
  );
  const useRepayBnbResult = useRepayBnb(options);

  return vTokenId === 'bnb' ? useRepayBnbResult : useRepayNonBnbResult;
};

export default useRepayVToken;
