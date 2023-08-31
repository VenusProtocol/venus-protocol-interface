import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Asset, Pool } from 'types';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';

import { UnderlyingTokenPriceMantissas } from '../types';

export interface FormatToPoolInput {
  name: string;
  description: string;
  comptrollerContractAddress: string;
  vTokenAddresses: string[];
  vTokenMetadataResults: Awaited<
    ReturnType<ContractTypeByName<'venusLens'>['callStatic']['vTokenMetadataAll']>
  >;
  currentBlockNumber: number;
  underlyingTokenPriceMantissas: UnderlyingTokenPriceMantissas;
  assetsInResult?: string[];
  userVTokenBalancesResults?: Awaited<
    ReturnType<ContractTypeByName<'venusLens'>['callStatic']['vTokenBalancesAll']>
  >;
  vaiRepayAmountResult?: BigNumber;
  mainParticipantsCountResult?: Awaited<ReturnType<typeof getIsolatedPoolParticipantsCount>>;
}

const formatToPool = ({
  name,
  description,
  comptrollerContractAddress,
  vTokenAddresses,
  vTokenMetadataResults,
  currentBlockNumber,
  underlyingTokenPriceMantissas,
  assetsInResult,
  userVTokenBalancesResults,
  vaiRepayAmountResult,
  mainParticipantsCountResult,
}: FormatToPoolInput) => {
  // TODO: shape from data
  const assets: Asset[] = [];

  const pool: Pool = {
    comptrollerAddress: comptrollerContractAddress,
    name,
    description,
    isIsolated: false,
    assets,
  };

  return pool;
};

export default formatToPool;
