import { useMutation, MutationObserverOptions } from 'react-query';

import { exitMarket, IExitMarketInput, ExitMarketOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptroller } from 'hooks/useContract';

const useExitMarket = (
  // TODO: use custom error type
  options?: MutationObserverOptions<
    ExitMarketOutput,
    Error,
    Omit<IExitMarketInput, 'comptrollerContract'>
  >,
) => {
  const comptrollerContract = useComptroller();

  // @TODO: invalidate related queries on success
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
