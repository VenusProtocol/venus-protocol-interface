import type { PublicClient } from 'viem';
import { parseUnits } from 'viem';

import { assetData } from '__mocks__/models/asset';

import { jumpRateModelAbi, jumpRateModelV2Abi } from 'libs/contracts';

import { getVTokenUtilizationRate } from '..';

const fakeInterestRateModelContractAddress = '0x0000000000000000000000000000000000000000';
const fakeUtilizationRate = 100000000000000000n; // 10% utilization represented as 0.1 * 1e18

describe('getVTokenUtilizationRate', () => {
  const asset = assetData[0];
  const { decimals } = asset.vToken.underlyingToken;
  const expectedCashMantissa = parseUnits(asset.cashTokens.toFixed(), decimals);
  const expectedBorrowBalanceMantissa = parseUnits(asset.borrowBalanceTokens.toFixed(), decimals);
  const expectedReservesMantissa = parseUnits(asset.reserveTokens.toFixed(), decimals);
  const expectedBadDebtMantissa = parseUnits('0', decimals);

  test('returns the utilization rate in the correct format on success for standard pools', async () => {
    const readContractMock = vi.fn().mockResolvedValue(fakeUtilizationRate);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getVTokenUtilizationRate({
      publicClient: fakePublicClient,
      interestRateModelContractAddress: fakeInterestRateModelContractAddress,
      isIsolatedPoolMarket: false,
      asset: assetData[0],
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeInterestRateModelContractAddress,
      abi: jumpRateModelAbi,
      functionName: 'utilizationRate',
      args: [expectedCashMantissa, expectedBorrowBalanceMantissa, expectedReservesMantissa],
    });

    expect(response).toEqual({ utilizationRatePercentage: 10 });
    expect(response).toMatchSnapshot();
  });

  test('returns the utilization rate in the correct format on success for isolated pools', async () => {
    const readContractMock = vi.fn().mockResolvedValue(fakeUtilizationRate);

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getVTokenUtilizationRate({
      publicClient: fakePublicClient,
      interestRateModelContractAddress: fakeInterestRateModelContractAddress,
      isIsolatedPoolMarket: true,
      asset: assetData[0],
    });

    expect(readContractMock).toHaveBeenCalledTimes(1);
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeInterestRateModelContractAddress,
      abi: jumpRateModelV2Abi,
      functionName: 'utilizationRate',
      args: [
        expectedCashMantissa,
        expectedBorrowBalanceMantissa,
        expectedReservesMantissa,
        expectedBadDebtMantissa,
      ],
    });

    expect(response).toEqual({ utilizationRatePercentage: 10 });
    expect(response).toMatchSnapshot();
  });
});
