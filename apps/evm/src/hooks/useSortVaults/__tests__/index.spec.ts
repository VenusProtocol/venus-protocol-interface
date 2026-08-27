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
    const inactiveVault = {
      ...institutionalVault,
      key: 'inactive-vault',
      status: VaultStatus.Inactive,
      stakeAprPercentage: 100,
    } satisfies InstitutionalVault;
    const [vaiVault, xvsVault] = venusVaults;

    const { result } = renderHook(() =>
      useSortVaults({
        vaults: [
          inactiveVault,
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
      inactiveVault.key,
    ]);
  });

  it('ranks a settled institutional vault on its realized APR', () => {
    const settledLowRealized = {
      ...institutionalVault,
      key: 'settled-low-realized',
      status: VaultStatus.Claim,
      isSettled: true,
      stakeAprPercentage: 100,
      realizedAprPercentage: 1,
    } satisfies InstitutionalVault;
    const settledHighRealized = {
      ...institutionalVault,
      key: 'settled-high-realized',
      status: VaultStatus.Claim,
      isSettled: true,
      stakeAprPercentage: 1,
      realizedAprPercentage: 100,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() =>
      useSortVaults({ vaults: [settledLowRealized, settledHighRealized] }),
    );

    expect(result.current.map(v => v.key)).toEqual([
      'settled-high-realized',
      'settled-low-realized',
    ]);
  });

  it('sorts a vault with no APY figure to the bottom of its tier', () => {
    const noRealizedApr = {
      ...institutionalVault,
      key: 'no-realized-apr',
      status: VaultStatus.Claim,
      isSettled: true,
      stakeAprPercentage: 100,
      realizedAprPercentage: undefined,
    } satisfies InstitutionalVault;
    const lowestRealizedApr = {
      ...institutionalVault,
      key: 'lowest-realized-apr',
      status: VaultStatus.Claim,
      isSettled: true,
      stakeAprPercentage: 1,
      realizedAprPercentage: 0.01,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() =>
      useSortVaults({ vaults: [noRealizedApr, lowestRealizedApr] }),
    );

    expect(result.current.map(v => v.key)).toEqual(['lowest-realized-apr', 'no-realized-apr']);
  });

  it('breaks an APY tie with the deployment date, newest first', () => {
    const older = {
      ...institutionalVault,
      key: 'older',
      status: VaultStatus.Refund,
      stakeAprPercentage: 5,
      vaultDeploymentDate: new Date('2026-01-01T00:00:00.000Z'),
    } satisfies InstitutionalVault;
    const newer = {
      ...institutionalVault,
      key: 'newer',
      status: VaultStatus.Refund,
      stakeAprPercentage: 5,
      vaultDeploymentDate: new Date('2026-06-01T00:00:00.000Z'),
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useSortVaults({ vaults: [older, newer] }));

    expect(result.current.map(v => v.key)).toEqual(['newer', 'older']);
  });

  it('breaks an APY and deployment date tie with the TVL, highest first', () => {
    const deploymentDate = new Date('2026-01-01T00:00:00.000Z');
    const smallerTvl = {
      ...institutionalVault,
      key: 'smaller-tvl',
      status: VaultStatus.Refund,
      stakeAprPercentage: 5,
      vaultDeploymentDate: deploymentDate,
      stakeBalanceCents: 100,
    } satisfies InstitutionalVault;
    const biggerTvl = {
      ...institutionalVault,
      key: 'bigger-tvl',
      status: VaultStatus.Refund,
      stakeAprPercentage: 5,
      vaultDeploymentDate: deploymentDate,
      stakeBalanceCents: 200,
    } satisfies InstitutionalVault;

    const { result } = renderHook(() => useSortVaults({ vaults: [smallerTvl, biggerTvl] }));

    expect(result.current.map(v => v.key)).toEqual(['bigger-tvl', 'smaller-tvl']);
  });
});
