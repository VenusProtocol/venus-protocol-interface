import { useMutation, MutationObserverOptions } from 'react-query';

import FunctionKey from 'constants/functionKey';
import { requestFaucetFunds, RequestFaucetFundsInput, RequestFaucetFundsOutput } from 'clients/api';

const useRequestFaucetFunds = (
  // TODO: use custom error type
  options?: MutationObserverOptions<RequestFaucetFundsOutput, Error, RequestFaucetFundsInput>,
) => useMutation(FunctionKey.REQUEST_FAUCET_FUNDS, requestFaucetFunds, options);

export default useRequestFaucetFunds;
