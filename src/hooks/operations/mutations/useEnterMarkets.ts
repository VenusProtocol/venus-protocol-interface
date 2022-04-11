import { useMutation, MutationObserverOptions } from 'react-query';
import { useComptroller } from 'hooks/useContract';
import { enterMarkets, IEnterMarketsInput, EnterMarketsOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  EnterMarketsOutput,
  Error,
  Omit<IEnterMarketsInput, 'comptrollerContract'>
>;

const useEnterMarkets = (
  // TODO: use custom error type
  options?: Options,
) => {
  const comptrollerContract = useComptroller();
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
