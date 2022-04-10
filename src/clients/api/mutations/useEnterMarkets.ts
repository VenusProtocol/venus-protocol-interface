import { useMutation, MutationObserverOptions } from 'react-query';

import { enterMarkets, IEnterMarketsInput, EnterMarketsOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptroller } from 'hooks/useContract';

const useEnterMarkets = (
  // TODO: use custom error type
  options?: MutationObserverOptions<
    EnterMarketsOutput,
    Error,
    Omit<IEnterMarketsInput, 'comptrollerContract'>
  >,
) => {
  const comptrollerContract = useComptroller();

  // @TODO: invalidate related queries on success
  return useMutation(
    FunctionKey.ENTER_MARKETS,
    (params: Omit<IEnterMarketsInput, 'comptrollerContract'>) =>
      enterMarkets({
        comptrollerContract,
        ...params,
      }),
    options,
  );
};

export default useEnterMarkets;
