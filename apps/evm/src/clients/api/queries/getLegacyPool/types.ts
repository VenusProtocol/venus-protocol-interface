import type {
  LegacyPoolComptroller,
  Prime,
  ResilientOracle,
  VaiController,
  VenusLens,
} from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { ChainId, Pool, Token } from 'types';

export interface GetLegacyPoolInput {
  chainId: ChainId;
  blocksPerDay: number;
  provider: Provider;
  name: string;
  description: string;
  xvs: Token;
  vai: Token;
  tokens: Token[];
  legacyPoolComptrollerContract: LegacyPoolComptroller;
  venusLensContract: VenusLens;
  resilientOracleContract: ResilientOracle;
  vaiControllerContract: VaiController;
  vTreasuryContractAddress: string;
  primeContract?: Prime;
  accountAddress?: string;
}

export interface GetLegacyPoolOutput {
  pool: Pool;
}
