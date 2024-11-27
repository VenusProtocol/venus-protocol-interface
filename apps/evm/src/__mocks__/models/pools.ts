import { chainMetadata } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';

import apiPoolsResponse from '__mocks__/api/pools.json';
import { assetData } from '__mocks__/models/asset';

import formatToPool from 'clients/api/queries/getApiPools/formatToPool';
import { ChainId, type Pool } from 'types';

const { corePoolComptrollerContractAddress } = chainMetadata[ChainId.BSC_TESTNET];

export const apiPoolsData = apiPoolsResponse.result.map(apiPoolData =>
  formatToPool({
    apiPoolData,
    corePoolComptrollerContractAddress,
    chainId: ChainId.BSC_TESTNET,
  }),
);

export const poolData: Pool[] = [
  {
    comptrollerAddress: '0x94d1820b2d1c7c7452a163983dc888cec546b77d',
    assets: assetData,
    name: 'Venus',
    description: 'Fake description 1',
    isIsolated: false,
    userSupplyBalanceCents: new BigNumber(123879865),
    userBorrowBalanceCents: new BigNumber(12333),
    userBorrowLimitCents: new BigNumber(192673),
  },
  {
    comptrollerAddress: '0x10b57706ad2345e590c2ea4dc02faef0d9f5b08b',
    assets: assetData,
    name: 'Metaverse',
    description: 'Fake description 2',
    isIsolated: true,
    userSupplyBalanceCents: new BigNumber(0),
    userBorrowBalanceCents: new BigNumber(0),
    userBorrowLimitCents: new BigNumber(0),
  },
];
