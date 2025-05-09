import { fireEvent, waitFor } from '@testing-library/react';
import { vai, xvs } from '__mocks__/models/tokens';
import BigNumber from 'bignumber.js';
import { useStakeInVaiVault, useStakeInXvsVault } from 'clients/api';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useStakeInVault } from '..';

const fakeAmountMantissa = new BigNumber('10000000000000000');
const fakeStakeButtonLabel = 'Stake';

describe('useStakeInVault', () => {
  it('calls stakeInXvsVault with correct parameters when calling stake a poolIndex', async () => {
    const mockStakeInXvsVault = vi.fn();
    (useStakeInXvsVault as Mock).mockReturnValue({
      mutateAsync: mockStakeInXvsVault,
    });

    const fakePoolIndex = 6;

    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault();

      return (
        <>
          <button
            onClick={() =>
              stake({
                amountMantissa: fakeAmountMantissa,
                stakedToken: xvs,
                rewardToken: xvs,
                poolIndex: fakePoolIndex,
              })
            }
            type="button"
          >
            {fakeStakeButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on stake button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(mockStakeInXvsVault).toHaveBeenCalledTimes(1));
    expect(mockStakeInXvsVault).toHaveBeenCalledWith({
      amountMantissa: fakeAmountMantissa,
      poolIndex: fakePoolIndex,
      rewardToken: xvs,
      stakedToken: xvs,
    });
  });

  it('calls stakeInVaiVault with correct parameters when calling stake without a poolIndex and stakedToken is equal VAI', async () => {
    const mockStakeInVaiVault = vi.fn();
    (useStakeInVaiVault as Mock).mockReturnValue({
      mutateAsync: mockStakeInVaiVault,
    });

    const TestComponent: React.FC = () => {
      const { stake } = useStakeInVault();

      return (
        <>
          <button
            onClick={() =>
              stake({
                amountMantissa: fakeAmountMantissa,
                stakedToken: vai,
                rewardToken: xvs,
              })
            }
            type="button"
          >
            {fakeStakeButtonLabel}
          </button>
        </>
      );
    };

    const { getByText } = renderComponent(<TestComponent />);

    // Click on stake button
    fireEvent.click(getByText(fakeStakeButtonLabel));

    await waitFor(() => expect(mockStakeInVaiVault).toHaveBeenCalledTimes(1));
    expect(mockStakeInVaiVault).toHaveBeenCalledWith({
      amountMantissa: fakeAmountMantissa,
    });
  });
});
