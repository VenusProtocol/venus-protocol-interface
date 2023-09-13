import { ChainId } from 'types';

import { venusTokens } from '../tokenInfos/commonTokens';

export interface GetVenusTokensInput {
  chainId: ChainId;
}

export const getVenusTokens = ({ chainId }: GetVenusTokensInput) => venusTokens[chainId];
