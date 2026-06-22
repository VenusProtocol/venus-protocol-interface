import { fireEvent, screen } from '@testing-library/react';

import { assetData } from '__mocks__/models/asset';
import { renderComponent } from 'testUtils/render';

import { MarketActionsButton } from '..';

vi.mock('pages/Market/OperationForm', () => ({
  OperationForm: () => <div data-testid="operation-form" />,
}));

describe('pages/PrimeLeaderboard/MarketActionsButton', () => {
  it('opens the market operation modal when clicked', async () => {
    const asset = assetData[0];

    renderComponent(
      <MarketActionsButton asset={asset} poolComptrollerAddress={asset.vToken.address} />,
    );

    fireEvent.click(screen.getByLabelText('Open market actions'));

    expect(await screen.findByTestId('operation-form')).toBeInTheDocument();
  });
});
