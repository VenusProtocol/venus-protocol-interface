import { useMutation, MutationObserverOptions } from 'react-query';
import { useComptroller } from 'hooks/useContract';
import { exitMarket, IExitMarketInput, ExitMarketOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type Options = MutationObserverOptions<
  ExitMarketOutput,
  Error,
  Omit<IExitMarketInput, 'comptrollerContract'>
>;

const useExitMarket = (
  // TODO: use custom error type
  options?: Options,
) => {
  const comptrollerContract = useComptroller();
  return useMutation(
    FunctionKey.EXIT_MARKET,
    (params: Omit<IExitMarketInput, 'comptrollerContract'>) =>
      exitMarket({
        comptrollerContract,
        ...params,
      }),
    options,
  );
};

export default useExitMarket;
