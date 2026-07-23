import { fireEvent, screen, waitFor } from '@testing-library/react';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderComponent } from 'testUtils/render';
import { YieldGroupList } from '..';

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('YieldGroupList', () => {
  it('renders yield groups in card and table views', () => {
    renderComponent(<YieldGroupList liquidityHub={liquidityHubs[0]} />);

    expect(screen.getAllByText('Venus Core').length).toBeGreaterThan(1);
    expect(screen.getAllByText('Venus Flux').length).toBeGreaterThan(1);
  });

  it('toggles a yield group source list from the card view', async () => {
    renderComponent(<YieldGroupList liquidityHub={liquidityHubs[0]} />);

    const [highestApyCardLabel] = screen.getAllByText('Venus Flux');

    expect(screen.queryByText('Flux Vault')).not.toBeInTheDocument();

    fireEvent.click(highestApyCardLabel);

    await waitFor(() => expect(screen.getAllByText('Flux Vault').length).toBeGreaterThan(1));

    fireEvent.click(highestApyCardLabel);

    await waitFor(() => expect(screen.queryByText('Flux Vault')).not.toBeInTheDocument());
  });
});
