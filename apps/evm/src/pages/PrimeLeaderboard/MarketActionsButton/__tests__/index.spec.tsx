import { fireEvent, screen } from '@testing-library/react';

import { assetData } from '__mocks__/models/asset';
import { renderComponent } from 'testUtils/render';

import { MarketActionsButton } from '..';

vi.mock('containers/MarketFormModal', () => ({
  MarketFormModal: ({ initialActiveTabId }: { initialActiveTabId?: string }) => (
    <div data-testid="market-form-modal" data-initial-tab={initialActiveTabId} />
  ),
}));

const asset = assetData[0];
const { symbol } = asset.vToken.underlyingToken;

describe('pages/PrimeLeaderboard/MarketActionsButton', () => {
  it.each([
    { side: undefined, label: `Supply ${symbol} to earn this Prime APY.`, tab: 'supply' },
    { side: 'supply' as const, label: `Supply ${symbol} to earn this Prime APY.`, tab: 'supply' },
    { side: 'borrow' as const, label: `Borrow ${symbol} to earn this Prime APY.`, tab: 'borrow' },
    {
      side: 'both' as const,
      label: `Supply or borrow ${symbol} to earn this Prime APY.`,
      tab: 'supply',
    },
  ])('opens the $tab tab for the $side side', async ({ side, label, tab }) => {
    renderComponent(
      <MarketActionsButton
        asset={asset}
        poolComptrollerAddress={asset.vToken.address}
        side={side}
      />,
    );

    fireEvent.click(screen.getByLabelText(label));

    expect(await screen.findByTestId('market-form-modal')).toHaveAttribute('data-initial-tab', tab);
  });
});
