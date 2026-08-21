import tokens from '__mocks__/models/tokens';
import { institutionalVault, pendleBnbVault, vaults as venusVaults } from '__mocks__/models/vaults';
import { useGetToken } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import { type InstitutionalVault, VaultStatus } from 'types';
import type { Mock } from 'vitest';

import { useSortVaults } from '..';

describe('useSortVaults', () => {
  beforeEach(() => {
    (useGetToken as Mock).mockImplementation(({ symbol }: { symbol: string }) =>
      tokens.find(token => token.symbol === symbol),
    );
  });

  it('sorts vaults by tier, then by APR descending', () => {
    const depositVault = {
      ...pendleBnbVault,
      key: 'deposit-vault',
      stakeAprPercentage: 1,
    };
    const refundVault = {
      ...institutionalVault,
      key: 'refund-vault',
      status: VaultStatus.Refund,
      stakeAprPercentage: 1,
    } satisfies InstitutionalVault;
    const higherAprRefundVault = {
      ...institutionalVault,
      key: 'higher-apr-refund-vault',
      status: VaultStatus.Refund,
      stakeAprPercentage: 2,
    } satisfies InstitutionalVault;
    const repayingVault = {
      ...institutionalVault,
      key: 'repaying-vault',
      status: VaultStatus.Repaying,
    } satisfies InstitutionalVault;
    const claimVault = {
      ...institutionalVault,
      key: 'claim-vault',
      status: VaultStatus.Claim,
    } satisfies InstitutionalVault;
    const pendingVault = {
      ...institutionalVault,
      key: 'pending-vault',
      status: VaultStatus.Pending,
    } satisfies InstitutionalVault;
    const activeVault = {
      ...institutionalVault,
      key: 'active-vault',
      status: VaultStatus.Active,
      stakeAprPercentage: 100,
    } satisfies InstitutionalVault;
    const [vaiVault, xvsVault] = venusVaults;

    const { result } = renderHook(() =>
      useSortVaults({
        vaults: [
          activeVault,
          xvsVault,
          vaiVault,
          pendingVault,
          claimVault,
          repayingVault,
          refundVault,
          higherAprRefundVault,
          depositVault,
        ],
      }),
    );

    expect(result.current.map(vault => vault.key)).toEqual([
      depositVault.key,
      higherAprRefundVault.key,
      refundVault.key,
      repayingVault.key,
      claimVault.key,
      pendingVault.key,
      vaiVault.key,
      xvsVault.key,
      activeVault.key,
    ]);
  });
});
