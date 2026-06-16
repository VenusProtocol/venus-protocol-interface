import { fireEvent, screen } from '@testing-library/react';

import { xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { MarketActions } from '..';

vi.mock('pages/Market/OperationForm', () => ({
  OperationForm: () => <div data-testid="operation-form" />,
}));

describe('pages/PrimeLeaderboard/MarketActions', () => {
  it('opens the market operation modal when clicked', async () => {
    renderComponent(<MarketActions token={xvs} />);

    fireEvent.click(screen.getByLabelText('Open market actions'));

    expect(await screen.findByTestId('operation-form')).toBeInTheDocument();
  });
});
