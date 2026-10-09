import spokePoolsResponse from '__mocks__/api/spokePools.json';
import spokePositionsResponse from '__mocks__/api/spokePositions.json';
import { usdc, usdt } from '__mocks__/models/tokens';
import BigNumber from 'bignumber.js';
import { formatToSpokePool } from 'clients/api/queries/getSpokePools/formatToSpokePool';
import type {
  GetSpokePoolsResponse,
  SpokeUserPosition,
} from 'clients/api/queries/getSpokePools/types';
import { ChainId, type SpokePool } from 'types';

const { result: apiPools = [] } = spokePoolsResponse as GetSpokePoolsResponse;
const userPositions: SpokeUserPosition[] = spokePositionsResponse.result.flatMap(accountPool =>
  accountPool.positions.map(position => ({
    vTokenAddress: position.marketAddress as SpokeUserPosition['vTokenAddress'],
    supplyBalanceMantissa: new BigNumber(position.underlyingBalanceMantissa),
    borrowBalanceMantissa: new BigNumber(position.borrowBalanceMantissa),
    isCollateral: position.isCollateral,
  })),
);

export const spokePools: SpokePool[] = apiPools.map(apiPool =>
  formatToSpokePool({
    apiPool,
    chainId: ChainId.BSC_TESTNET,
    tokens: [usdc, usdt],
    isUserConnected: true,
    isUserDataUnavailable: false,
    userPositions,
    userTokenBalances: [],
    apiTokens: [],
  }),
);
