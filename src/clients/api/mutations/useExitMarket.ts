import { useMutation, MutationObserverOptions } from 'react-query';

import { exitMarket, IExitMarketInput, ExitMarketOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';

const useExitMarket = (
  // TODO: use custom error type
  options?: MutationObserverOptions<ExitMarketOutput, Error, IExitMarketInput>,
) =>
  useMutation<ExitMarketOutput, Error, IExitMarketInput>(
    FunctionKey.EXIT_MARKET,
    exitMarket,
    options,
  );

export default useExitMarket;
