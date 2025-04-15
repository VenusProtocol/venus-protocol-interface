import BigNumber from 'bignumber.js';
import type { PublicClient } from 'viem';

import fakeAddress from '__mocks__/models/address';

import { xVSProxyOFTSrcAbi } from 'libs/contracts';
import { ChainId } from 'types';

import { convertPriceMantissaToDollars } from 'utilities';
import { BRIDGE_USD_LIMIT_FACTOR, getXvsBridgeStatus } from '..';

describe('getXvsBridgeStatus', () => {
  const mockDailyLimitResetTimestamp = 1705273290n;
  const mockDailyLimitUsdMantissa = 500000000000000000000n;
  const mockLast24HourTransferredUsdMantissa = 9310366874000000000n;
  const mockMaxSingleTransactionLimitUsdMantissa = 10000000000000000000n;
  const mockLowerDailyLimitUsdMantissa = 400000000000000000000n;
  const mockLowerMaxSingleTransactionLimitUsdMantissa = 1000000000000000000n;

  it('returns the correct data', async () => {
    // Create a mock function that returns different values based on functionName
    const readContractMock = vi.fn().mockImplementation(({ functionName }) => {
      switch (functionName) {
        case 'chainIdToLast24HourWindowStart':
          return Promise.resolve(mockDailyLimitResetTimestamp);
        case 'chainIdToMaxDailyLimit':
          return Promise.resolve(mockDailyLimitUsdMantissa);
        case 'chainIdToLast24HourTransferred':
          return Promise.resolve(mockLast24HourTransferredUsdMantissa);
        case 'chainIdToMaxSingleTransactionLimit':
          return Promise.resolve(mockMaxSingleTransactionLimitUsdMantissa);
        case 'chainIdToMaxDailyReceiveLimit':
          return Promise.resolve(mockDailyLimitUsdMantissa);
        case 'chainIdToMaxSingleReceiveTransactionLimit':
          return Promise.resolve(mockMaxSingleTransactionLimitUsdMantissa);
      }
    });

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsBridgeStatus({
      fromChainId: ChainId.ZKSYNC_SEPOLIA,
      fromChainBridgeContractAddress: fakeAddress,
      toChainId: ChainId.BSC_TESTNET,
      toChainBridgeContractAddress: fakeAddress,
      fromChainPublicClient: fakePublicClient,
      toChainPublicClient: fakePublicClient,
    });

    expect(readContractMock).toHaveBeenCalledTimes(6);

    // Check calls to the fromChainPublicClient
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToLast24HourWindowStart',
      args: expect.any(Array),
    });

    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToMaxDailyLimit',
      args: expect.any(Array),
    });

    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToLast24HourTransferred',
      args: expect.any(Array),
    });

    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToMaxSingleTransactionLimit',
      args: expect.any(Array),
    });

    // Check calls to the toChainPublicClient
    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToMaxDailyReceiveLimit',
      args: expect.any(Array),
    });

    expect(readContractMock).toHaveBeenCalledWith({
      address: fakeAddress,
      abi: xVSProxyOFTSrcAbi,
      functionName: 'chainIdToMaxSingleReceiveTransactionLimit',
      args: expect.any(Array),
    });

    expect(response).toMatchSnapshot();
  });

  it('returns the limits from the fromChain contract if they are lower than the toChain contract', async () => {
    // Create a mock function that returns different values based on functionName
    const readContractMock = vi.fn().mockImplementation(({ functionName }) => {
      switch (functionName) {
        case 'chainIdToLast24HourWindowStart':
          return Promise.resolve(mockDailyLimitResetTimestamp);
        case 'chainIdToMaxDailyLimit':
          return Promise.resolve(mockDailyLimitUsdMantissa);
        case 'chainIdToLast24HourTransferred':
          return Promise.resolve(mockLast24HourTransferredUsdMantissa);
        case 'chainIdToMaxSingleTransactionLimit':
          return Promise.resolve(mockMaxSingleTransactionLimitUsdMantissa);
        case 'chainIdToMaxDailyReceiveLimit':
          return Promise.resolve(mockLowerDailyLimitUsdMantissa);
        case 'chainIdToMaxSingleReceiveTransactionLimit':
          return Promise.resolve(mockLowerMaxSingleTransactionLimitUsdMantissa);
      }
    });

    const fakePublicClient = {
      readContract: readContractMock,
    } as unknown as PublicClient;

    const response = await getXvsBridgeStatus({
      fromChainId: ChainId.ZKSYNC_SEPOLIA,
      fromChainBridgeContractAddress: fakeAddress,
      toChainId: ChainId.BSC_TESTNET,
      toChainBridgeContractAddress: fakeAddress,
      fromChainPublicClient: fakePublicClient,
      toChainPublicClient: fakePublicClient,
    });

    expect(response.maxDailyLimitUsd.toString()).toBe(
      convertPriceMantissaToDollars({
        priceMantissa: new BigNumber(mockLowerDailyLimitUsdMantissa.toString()),
        decimals: 18,
      })
        .multipliedBy(BRIDGE_USD_LIMIT_FACTOR)
        .toString(),
    );
    expect(response.maxSingleTransactionLimitUsd.toString()).toBe(
      convertPriceMantissaToDollars({
        priceMantissa: new BigNumber(mockLowerMaxSingleTransactionLimitUsdMantissa.toString()),
        decimals: 18,
      })
        .multipliedBy(BRIDGE_USD_LIMIT_FACTOR)
        .toString(),
    );
  });
});
