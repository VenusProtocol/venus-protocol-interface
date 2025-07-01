import fakeAccountAddress from '__mocks__/models/address';
import { bnb, busd, usdt, xvs } from '__mocks__/models/tokens';

import type { PublicClient } from 'viem';
import { getImportableAaveSupplyPositions } from '..';

const aaveUserReserves = [
  {
    underlyingAsset: xvs.address,
    scaledATokenBalance: 3000000000000000000000000000n,
    scaledVariableDebt: 0n,
    usageAsCollateralEnabledOnUser: true,
  },
  {
    underlyingAsset: bnb.address,
    scaledATokenBalance: 0n,
    scaledVariableDebt: 0n,
    usageAsCollateralEnabledOnUser: true,
  },
  {
    underlyingAsset: usdt.address,
    scaledATokenBalance: 2000000000000000000000000000n,
    scaledVariableDebt: 0n,
    usageAsCollateralEnabledOnUser: false,
  },
];

const aaveReserves = [
  {
    underlyingAsset: xvs.address,
    aTokenAddress: '0xfakeXvsATokenAddress',
    liquidityIndex: 1005578039594992230208979842n,
    liquidityRate: 1553070094836071429681546n,
    availableLiquidity: 90000000000000000000000000000n,
  },
  {
    underlyingAsset: bnb.address,
    aTokenAddress: '0xfakeBnbATokenAddress',
    liquidityIndex: 4005578039594992230208979842n,
    liquidityRate: 1553070094836071429681546n,
    availableLiquidity: 90000000000000000000000000000n,
  },
  {
    underlyingAsset: usdt.address,
    aTokenAddress: '0xfakeUsdtATokenAddress',
    liquidityIndex: 3005578039594992230208979842n,
    liquidityRate: 1553070094836071429681546n,
    availableLiquidity: 10000n,
  },
  {
    underlyingAsset: busd.address,
    aTokenAddress: '0xfakeBusdATokenAddress',
    liquidityIndex: 2005578039594992230208979842n,
    liquidityRate: 1553070094836071429681546n,
    availableLiquidity: 90000000000000000000000000000n,
  },
];

describe('getImportableAaveSupplyPositions', () => {
  it('returns the importable positions on success', async () => {
    const fakePublicClient = {
      multicall: vi.fn(() => [
        {
          result: [aaveUserReserves],
        },
        {
          result: [aaveReserves],
        },
      ]),
    } as unknown as PublicClient;

    const result = await getImportableAaveSupplyPositions({
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
      aaveUiPoolDataProviderContractAddress: '0xfakeAaveUiPoolDataProviderContractAddress',
      aavePoolAddressesProviderContractAddress: '0xfakeAavePoolAddressesProviderContractAddress',
    });

    expect(result).toMatchSnapshot();
  });

  it('returns no importable positions if user has borrow positions', async () => {
    const customAaaveUserReserves = [...aaveUserReserves];
    customAaaveUserReserves[1].scaledVariableDebt = 100n;

    const fakePublicClient = {
      multicall: vi.fn(() => [
        {
          result: [customAaaveUserReserves],
        },
        {
          result: [aaveReserves],
        },
      ]),
    } as unknown as PublicClient;

    const result = await getImportableAaveSupplyPositions({
      publicClient: fakePublicClient,
      accountAddress: fakeAccountAddress,
      aaveUiPoolDataProviderContractAddress: '0xfakeAaveUiPoolDataProviderContractAddress',
      aavePoolAddressesProviderContractAddress: '0xfakeAavePoolAddressesProviderContractAddress',
    });

    expect(result).toMatchSnapshot();
  });
});
