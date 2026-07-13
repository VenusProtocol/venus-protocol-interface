import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetPools, useGetVaults } from 'clients/api';
import { VIP_PORTFOLIO_THRESHOLD_CENTS } from 'constants/vip';
import { useAccountAddress } from 'libs/wallet';
import { renderHook } from 'testUtils/render';

import { useIsConnectedAccountVip } from '..';

const createAsset = ({
  userBorrowBalanceCents = 0,
  userSupplyBalanceCents = 0,
}: {
  userBorrowBalanceCents?: number;
  userSupplyBalanceCents?: number;
}) => ({
  userBorrowBalanceCents: new BigNumber(userBorrowBalanceCents),
  userSupplyBalanceCents: new BigNumber(userSupplyBalanceCents),
});

const createPool = (
  assets: Array<{
    userBorrowBalanceCents: BigNumber;
    userSupplyBalanceCents: BigNumber;
  }>,
) => ({
  assets,
});

const createVault = ({ userStakeBalanceCents = 0 }: { userStakeBalanceCents?: number }) => ({
  userStakeBalanceCents,
});

describe('useIsConnectedAccountVip', () => {
  beforeEach(() => {
    (useAccountAddress as Mock).mockReturnValue({
      accountAddress: undefined,
    });

    (useGetPools as Mock).mockReturnValue({
      data: undefined,
    });

    (useGetVaults as Mock).mockReturnValue({
      data: [],
    });
  });

  it('passes the connected account address to useGetPools and useGetVaults', () => {
    (useAccountAddress as Mock).mockReturnValue({
      accountAddress: fakeAccountAddress,
    });

    renderHook(() => useIsConnectedAccountVip());

    expect(useGetPools).toHaveBeenCalledWith({
      accountAddress: fakeAccountAddress,
    });

    expect(useGetVaults).toHaveBeenCalledWith({
      accountAddress: fakeAccountAddress,
    });
  });

  it('returns true when the portfolio value reaches the VIP threshold across pools and vaults', () => {
    (useGetPools as Mock).mockReturnValue({
      data: {
        pools: [
          createPool([
            createAsset({
              userSupplyBalanceCents: 10_000_000,
              userBorrowBalanceCents: 15_000_000,
            }),
            createAsset({
              userSupplyBalanceCents: 20_000_000,
            }),
          ]),
        ],
      },
    });
    (useGetVaults as Mock).mockReturnValue({
      data: [
        createVault({
          userStakeBalanceCents: VIP_PORTFOLIO_THRESHOLD_CENTS - 45_000_000,
        }),
      ],
    });

    const { result } = renderHook(() => useIsConnectedAccountVip());

    expect(result.current.isConnectedAccountVip).toBe(true);
  });

  it('returns false when the portfolio value is below the VIP threshold', () => {
    (useGetPools as Mock).mockReturnValue({
      data: {
        pools: [
          createPool([
            createAsset({
              userSupplyBalanceCents: 25_000_000,
              userBorrowBalanceCents: VIP_PORTFOLIO_THRESHOLD_CENTS - 25_000_001,
            }),
          ]),
        ],
      },
    });

    const { result } = renderHook(() => useIsConnectedAccountVip());

    expect(result.current.isConnectedAccountVip).toBe(false);
  });

  it('returns false when pool data is unavailable', () => {
    const { result } = renderHook(() => useIsConnectedAccountVip());

    expect(result.current.isConnectedAccountVip).toBe(false);
  });
});
