import { ChainId } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import type { GetFixedRatedVaultsOutput } from 'clients/api/queries/getFixedRatedVaults/types';
import { VaultCategory, VaultManager, VaultStatus, VaultType } from 'types';
import { formatToInstitutionalVault } from '..';

const fakeLoanVaultDetail = {
  chainId: '97',
  collateralAssetAddress: '0x0000000000000000000000000000000000000001',
  collateralValueCents: '0',
  createdAt: '2025-01-01T00:00:00.000Z',
  debtValueCents: '0',
  fixedRateVaultId: 'vault-1',
  id: 'loan-1',
  institutionAddress: '0x0000000000000000000000000000000000000002' as const,
  latePenaltyRateMantissa: '0',
  liquidationIncentiveMantissa: '0',
  liquidationThresholdMantissa: '0',
  liquidityMantissa: '5000000000',
  lockEndTime: '2025-06-01T00:00:00.000Z',
  maxBorrowCapMantissa: '10000000000',
  minBorrowCapMantissa: '100000000',
  openEndTime: '2025-02-01T00:00:00.000Z',
  outstandingDebtMantissa: '0',
  reserveFactorMantissa: '0',
  settlementDeadline: '2025-07-01T00:00:00.000Z',
  shortfallMantissa: '0',
  supplyAssetAddress: '0x0000000000000000000000000000000000000003',
  totalOwedMantissa: '0',
  totalRaisedMantissa: '2000000000',
  updatedAt: '2025-01-02T00:00:00.000Z',
  vaultState: 2,
};

const fakeVaultData: GetFixedRatedVaultsOutput[number] = {
  id: 'vault-1',
  chainId: '97',
  protocol: 'institutional-vault',
  vaultAddress: '0x1234567890abcdef1234567890abcdef12345678',
  underlyingAssetAddress: '0x312e39c7641cE64BEccDe53613f07952258fa810',
  fixedApyDecimal: '0.05',
  maturityDate: '2025-08-01T00:00:00.000Z',
  protocolData: {
    institutionOperatorAddress: '0x0000000000000000000000000000000000000002',
    latePenaltyRateMantissa: '0',
    lockDurationSeconds: 12960000,
    openDurationSeconds: 2678400,
    settlementWindowSeconds: 2592000,
  },
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  loanVaultDetail: fakeLoanVaultDetail,
  underlyingToken: [],
};

describe('formatToInstitutionalVault', () => {
  it('formats vault data correctly', () => {
    const result = formatToInstitutionalVault({
      vaultData: fakeVaultData,
      chainId: ChainId.BSC_TESTNET,
      pools: [],
      nowMs: new Date('2025-01-15T00:00:00.000Z').getTime(),
      userStakedAmount: {
        vaultAddress: '0x1234567890abcdef1234567890abcdef12345678',
        tokensMantissa: new BigNumber('500000000'),
      },
    });

    expect(result).toBeDefined();
    expect(result?.key).toBe('vault-1');
    expect(result?.vaultType).toBe(VaultType.Institutional);
    expect(result?.manager).toBe(VaultManager.Ceefu);
    expect(result?.category).toBe(VaultCategory.Stablecoins);
    expect(result?.stakingAprPercentage).toBe(5);
    expect(result?.vaultAddress).toBe('0x1234567890abcdef1234567890abcdef12345678');
    expect(result?.status).toBe(VaultStatus.Deposit);
    expect(result?.userStakedMantissa).toEqual(new BigNumber('500000000'));
    expect(result?.totalStakedMantissa).toEqual(new BigNumber('2000000000'));
    expect(result?.totalDepositedMantissa).toEqual(new BigNumber('2000000000'));
    expect(result?.maxDepositedMantissa).toEqual(new BigNumber('10000000000'));
    expect(result?.minRequestMantissa).toEqual(new BigNumber('100000000'));
    expect(result?.managerAddress).toBe('0x0000000000000000000000000000000000000002');
    expect(result?.managerLink).toBe('https://www.matrixdock.com');
    expect(result?.managerIcon).toBe('ceefu');
    expect(result?.openEndDate).toEqual(new Date('2025-02-01T00:00:00.000Z'));
    expect(result?.lockEndDate).toEqual(new Date('2025-06-01T00:00:00.000Z'));
    expect(result?.settlementDate).toEqual(new Date('2025-07-01T00:00:00.000Z'));
    expect(result?.maturityDate).toEqual(new Date('2025-08-01T00:00:00.000Z'));
  });

  it('returns undefined when loanVaultDetail is missing', () => {
    const result = formatToInstitutionalVault({
      vaultData: { ...fakeVaultData, loanVaultDetail: undefined },
      chainId: ChainId.BSC_TESTNET,
      pools: [],
      nowMs: Date.now(),
    });

    expect(result).toBeUndefined();
  });

  it('defaults userStakedMantissa to 0 when userStakedAmount is not provided', () => {
    const result = formatToInstitutionalVault({
      vaultData: fakeVaultData,
      chainId: ChainId.BSC_TESTNET,
      pools: [],
      nowMs: new Date('2025-01-15T00:00:00.000Z').getTime(),
    });

    expect(result?.userStakedMantissa).toEqual(new BigNumber(0));
  });
});
