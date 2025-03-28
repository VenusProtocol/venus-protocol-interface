import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';

import type { XVSProxyOFTDest, XVSProxyOFTSrc } from 'libs/contracts';
import { ChainId } from 'types';

import { convertPriceMantissaToDollars } from 'utilities';
import { BRIDGE_USD_LIMIT_FACTOR, getXvsBridgeStatus } from '.';

vi.mock('libs/contracts');

describe('getXvsBridgeStatus', () => {
  const mockDailyLimitResetTimestamp = '1705273290';
  const mockDailyLimitUsdMantissa = '500000000000000000000';
  const mockLast24HourTransferredUsdMantissa = '9310366874000000000';
  const mockMaxSingleTransactionLimitUsdMantissa = '10000000000000000000';

  const fakeXvsBridgeSendingContract = {
    chainIdToLast24HourWindowStart: vi.fn(() => BN.from(mockDailyLimitResetTimestamp)),
    chainIdToMaxDailyLimit: vi.fn(() => BN.from(mockDailyLimitUsdMantissa)),
    chainIdToLast24HourTransferred: vi.fn(
      () => new BigNumber(mockLast24HourTransferredUsdMantissa),
    ),
    chainIdToMaxSingleTransactionLimit: vi.fn(
      () => new BigNumber(mockMaxSingleTransactionLimitUsdMantissa),
    ),
  } as unknown as XVSProxyOFTDest;

  const fakeXvsBridgeReceivingEndContract = {
    chainIdToMaxDailyReceiveLimit: vi.fn(() => BN.from(mockDailyLimitUsdMantissa)),
    chainIdToMaxSingleReceiveTransactionLimit: vi.fn(() =>
      BN.from(mockMaxSingleTransactionLimitUsdMantissa),
    ),
  } as unknown as XVSProxyOFTSrc;

  it('returns the data describing the status of the XVS bridge contract', async () => {
    const response = await getXvsBridgeStatus({
      fromChainId: ChainId.ZKSYNC_SEPOLIA,
      tokenBridgeSendingContract: fakeXvsBridgeSendingContract,
      toChainId: ChainId.BSC_TESTNET,
      receivingEndBridgeContract: fakeXvsBridgeReceivingEndContract,
    });

    expect(fakeXvsBridgeSendingContract.chainIdToLast24HourWindowStart).toHaveBeenCalledTimes(1);
    expect(fakeXvsBridgeSendingContract.chainIdToMaxDailyLimit).toHaveBeenCalledTimes(1);
    expect(fakeXvsBridgeSendingContract.chainIdToLast24HourTransferred).toHaveBeenCalledTimes(1);
    expect(fakeXvsBridgeSendingContract.chainIdToMaxSingleTransactionLimit).toHaveBeenCalledTimes(
      1,
    );
    expect(fakeXvsBridgeReceivingEndContract.chainIdToMaxDailyReceiveLimit).toHaveBeenCalledTimes(
      1,
    );
    expect(
      fakeXvsBridgeReceivingEndContract.chainIdToMaxSingleReceiveTransactionLimit,
    ).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });

  it('returns the limits from the receiving end if they are lower than the sending end', async () => {
    const mockLowerDailyLimitUsdMantissa = '400000000000000000000';
    const mockLowerMaxSingleTransactionLimitUsdMantissa = '1000000000000000000';
    const fakeXvsBridgeReceivingEndContractWithLowerLimits = {
      chainIdToMaxDailyReceiveLimit: vi.fn(() => BN.from(mockLowerDailyLimitUsdMantissa)),
      chainIdToMaxSingleReceiveTransactionLimit: vi.fn(() =>
        BN.from(mockLowerMaxSingleTransactionLimitUsdMantissa),
      ),
    } as unknown as XVSProxyOFTSrc;

    const response = await getXvsBridgeStatus({
      fromChainId: ChainId.ZKSYNC_SEPOLIA,
      tokenBridgeSendingContract: fakeXvsBridgeSendingContract,
      toChainId: ChainId.BSC_TESTNET,
      receivingEndBridgeContract: fakeXvsBridgeReceivingEndContractWithLowerLimits,
    });

    expect(response.maxDailyLimitUsd.toString()).toBe(
      convertPriceMantissaToDollars({
        priceMantissa: new BigNumber(mockLowerDailyLimitUsdMantissa),
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
