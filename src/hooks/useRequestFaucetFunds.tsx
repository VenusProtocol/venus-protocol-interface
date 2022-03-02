import { useMutation, MutationObserverOptions } from 'react-query';

import {
  requestFaucetFunds,
  IRequestFaucetFundsInput,
  IRequestFaucetFundsOutput,
} from 'clients/api';

export const REQUEST_FAUCET_FUNDS = 'REQUEST_FAUCET_FUNDS';

const useRequestFaucetFunds = (
  // TODO: use custom error type
  options?: MutationObserverOptions<IRequestFaucetFundsOutput, Error, IRequestFaucetFundsInput>,
) =>
  useMutation<IRequestFaucetFundsOutput, Error, IRequestFaucetFundsInput>(
    [REQUEST_FAUCET_FUNDS, options?.variables],
    requestFaucetFunds,
    options,
  );

export default useRequestFaucetFunds;
