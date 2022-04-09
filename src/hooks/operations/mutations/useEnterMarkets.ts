import { useMutation, MutationObserverOptions } from 'react-query';

import { enterMarkets, IEnterMarketsInput, EnterMarketsOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';

const useEnterMarkets = (
  // TODO: use custom error type
  options?: MutationObserverOptions<EnterMarketsOutput, Error, IEnterMarketsInput>,
) =>
  useMutation<EnterMarketsOutput, Error, IEnterMarketsInput>(
    FunctionKey.ENTER_MARKETS,
    enterMarkets,
    options,
  );

export default useEnterMarkets;
