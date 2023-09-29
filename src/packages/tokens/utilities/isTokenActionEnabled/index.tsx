import { ChainId, TokenAction } from 'types';

import areAddressesEqual from 'utilities/areAddressesEqual';

import disabledTokenActions from '../../tokenInfos/disabledTokenActions';

export interface IsTokenActionEnabledInput {
  tokenAddress: string;
  chainId: ChainId;
  action: TokenAction;
}

export const isTokenActionEnabled = ({
  tokenAddress,
  chainId,
  action,
}: IsTokenActionEnabledInput) => {
  const disabledToken = disabledTokenActions[chainId].find(item =>
    areAddressesEqual(item.address, tokenAddress),
  );

  return !disabledToken || !disabledToken.disabledActions.includes(action);
};
