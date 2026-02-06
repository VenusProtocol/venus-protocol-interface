import { type Mock, vi } from 'vitest';

import { HIDDEN_BALANCE_KEY } from 'constants/placeholders';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { renderComponent } from 'testUtils/render';
import { HidableUserBalance } from '..';

const fakeChildrenText = 'Visible balance';

describe('HidableUserBalance', () => {
  it('renders hidden balance placeholder when user settings hide balances', () => {
    (useUserChainSettings as Mock).mockImplementation(() => [
      {
        doNotShowUserBalances: true,
      },
      vi.fn(),
    ]);

    const { getByText, queryByText } = renderComponent(
      <HidableUserBalance>
        <span>{fakeChildrenText}</span>
      </HidableUserBalance>,
    );

    expect(getByText(HIDDEN_BALANCE_KEY)).toBeInTheDocument();
    expect(queryByText(fakeChildrenText)).toBeNull();
  });

  it('renders children when user settings allow balances', () => {
    (useUserChainSettings as Mock).mockImplementation(() => [
      {
        doNotShowUserBalances: false,
      },
      vi.fn(),
    ]);

    const { getByText, queryByText } = renderComponent(
      <HidableUserBalance>
        <span>{fakeChildrenText}</span>
      </HidableUserBalance>,
    );

    expect(getByText(fakeChildrenText)).toBeInTheDocument();
    expect(queryByText(HIDDEN_BALANCE_KEY)).toBeNull();
  });
});
