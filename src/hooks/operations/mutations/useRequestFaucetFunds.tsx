import { useMutation, MutationObserverOptions } from 'react-query';

import { requestFaucetFunds, RequestFaucetFundsInput, RequestFaucetFundsOutput } from 'clients/api';

export const REQUEST_FAUCET_FUNDS = 'REQUEST_FAUCET_FUNDS';

const useRequestFaucetFunds = (
  // TODO: use custom error type
  options?: MutationObserverOptions<RequestFaucetFundsOutput, Error, RequestFaucetFundsInput>,
) =>
  useMutation<RequestFaucetFundsOutput, Error, RequestFaucetFundsInput>(
    [REQUEST_FAUCET_FUNDS, options?.variables],
    requestFaucetFunds,
    options,
  );

export default useRequestFaucetFunds;
