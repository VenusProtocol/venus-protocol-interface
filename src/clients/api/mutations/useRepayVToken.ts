import { MutationObserverOptions } from 'react-query';

import {
  RepayBnbInput,
  RepayBnbOutput,
  RepayNonBnbVTokenInput,
  RepayNonBnbVTokenOutput,
  useRepayBnb,
  useRepayNonBnbVToken,
} from 'clients/api';

type Options = MutationObserverOptions<
  RepayBnbOutput | RepayNonBnbVTokenOutput,
  Error,
  Omit<RepayNonBnbVTokenInput, 'vTokenContract'> | Omit<RepayBnbInput, 'web3'>
>;

const useRepayVToken = ({ vTokenId }: { vTokenId: string }, options?: Options) => {
  const useRepayNonBnbVTokenResult = useRepayNonBnbVToken(
    { vTokenId: vTokenId as Exclude<string, 'bnb'> },
    options,
  );
  const useRepayBnbResult = useRepayBnb(options);

  return vTokenId === 'bnb' ? useRepayBnbResult : useRepayNonBnbVTokenResult;
};

export default useRepayVToken;
