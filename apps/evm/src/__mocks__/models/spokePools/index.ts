import spokePoolsResponse from '__mocks__/api/spokePools.json';
import spokePositionsResponse from '__mocks__/api/spokePositions.json';
import { usdc, usdt } from '__mocks__/models/tokens';
import { formatToSpokePool } from 'clients/api/queries/getSpokePools/formatToSpokePool';
import type {
  GetSpokePoolsResponse,
  GetSpokePositionsResponse,
} from 'clients/api/queries/getSpokePools/types';
import { ChainId, type SpokePool } from 'types';
import { areAddressesEqual } from 'utilities';

const { result: apiPools = [] } = spokePoolsResponse as GetSpokePoolsResponse;
const { result: apiAccountPools = [] } = spokePositionsResponse as GetSpokePositionsResponse;

export const spokePools: SpokePool[] = apiPools.map(apiPool =>
  formatToSpokePool({
    apiPool,
    chainId: ChainId.BSC_TESTNET,
    tokens: [usdc, usdt],
    isUserConnected: true,
    userAccountPool: apiAccountPools.find(accountPool =>
      areAddressesEqual(accountPool.comptrollerAddress, apiPool.address),
    ),
    userTokenBalances: [],
  }),
);
