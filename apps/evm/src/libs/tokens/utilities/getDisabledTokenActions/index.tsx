import type { ChainId } from 'types';
import areAddressesEqual from 'utilities/areAddressesEqual';

import disabledTokenActions from '../../infos/disabledTokenActions';

export interface GetDisabledTokenActionsInput {
  tokenAddress: string;
  chainId: ChainId;
}

export const getDisabledTokenActions = ({
  tokenAddress,
  chainId,
}: GetDisabledTokenActionsInput) => {
  const disabledToken = disabledTokenActions[chainId].find(item =>
    areAddressesEqual(item.address, tokenAddress),
  );

  return disabledToken?.disabledActions || [];
};
