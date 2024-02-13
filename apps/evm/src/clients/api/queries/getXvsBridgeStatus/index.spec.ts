import BigNumber from 'bignumber.js';
import { BigNumber as BN } from 'ethers';
import { XVSProxyOFTDest } from 'libs/contracts';

import { ChainId } from 'types';

import getXvsBridgeStatus from '.';

vi.mock('libs/contracts');

describe('getXvsBridgeStatus', () => {
  it('returns the the data describing the status of the XVS bridge contract', async () => {
    const mockDailyLimitResetTimestamp = '1705273290';
    const mockDailyLimitUsdMantissa = '500000000000000000000';
    const mockLast24HourTransferredUsdMantissa = '9310366874000000000';
    const mockMaxSingleTransactionLimitUsdMantissa = '10000000000000000000';

    const fakeXvsBridgeContract = {
      chainIdToLast24HourWindowStart: vi.fn(() => BN.from(mockDailyLimitResetTimestamp)),
      chainIdToMaxDailyLimit: vi.fn(() => BN.from(mockDailyLimitUsdMantissa)),
      chainIdToLast24HourTransferred: vi.fn(
        () => new BigNumber(mockLast24HourTransferredUsdMantissa),
      ),
      chainIdToMaxSingleTransactionLimit: vi.fn(
        () => new BigNumber(mockMaxSingleTransactionLimitUsdMantissa),
      ),
    } as unknown as XVSProxyOFTDest;

    const response = await getXvsBridgeStatus({
      toChainId: ChainId.BSC_TESTNET,
      tokenBridgeContract: fakeXvsBridgeContract,
    });

    expect(fakeXvsBridgeContract.chainIdToLast24HourWindowStart).toHaveBeenCalledTimes(1);
    expect(fakeXvsBridgeContract.chainIdToMaxDailyLimit).toHaveBeenCalledTimes(1);
    expect(fakeXvsBridgeContract.chainIdToLast24HourTransferred).toHaveBeenCalledTimes(1);
    expect(fakeXvsBridgeContract.chainIdToMaxSingleTransactionLimit).toHaveBeenCalledTimes(1);
    expect(response).toMatchSnapshot();
  });
});
