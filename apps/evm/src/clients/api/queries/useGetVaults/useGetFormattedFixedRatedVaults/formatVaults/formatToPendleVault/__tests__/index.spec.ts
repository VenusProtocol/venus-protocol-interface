import { assetData } from '__mocks__/models/asset';
import { fixedRatedVaults } from '__mocks__/models/vaults';
import type { PendleVaultProtocolData } from 'clients/api';
import type { Pool, Token } from 'types';

import { formatToPendleVault } from '..';

const vaultData = fixedRatedVaults[0];
const protocolData = vaultData.protocolData as PendleVaultProtocolData;

const asset = {
  ...assetData[0],
  vToken: { ...assetData[0].vToken, address: vaultData.vaultAddress },
};

const pools = [
  {
    ...({} as Pool),
    comptrollerAddress: '0x1111111111111111111111111111111111111111',
    name: 'Core Pool',
    assets: [asset],
  },
] as Pool[];

const tokens = [
  { ...asset.vToken.underlyingToken, address: protocolData.accountingAsset.address },
  { ...asset.vToken.underlyingToken, address: vaultData.underlyingAssetAddress },
] as Token[];

const format = (maturityDate: unknown) =>
  formatToPendleVault({
    vaultData: { ...vaultData, maturityDate } as typeof vaultData,
    pools,
    tokens,
    nowMs: new Date('2026-04-05T00:00:00.000Z').getTime(),
  });

describe('formatToPendleVault', () => {
  it('keeps a valid maturity date', () => {
    expect(format(vaultData.maturityDate)?.maturityDate).toEqual(
      new Date('2026-06-25T00:00:00.000Z'),
    );
  });

  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['unparseable', 'not-a-date'],
  ])('returns the vault with no maturity date when the API value is %s', (_label, value) => {
    const vault = format(value);

    expect(vault).toBeDefined();
    expect(vault?.maturityDate).toBeUndefined();
  });
});
