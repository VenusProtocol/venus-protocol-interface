import { fireEvent, screen, waitFor } from '@testing-library/react';

import { usdtCentrifugeYieldGroup } from '__mocks__/models/liquidityHubYieldGroups';
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

  it('renders the Centrifuge funds group and expands it into a fund sub-table', async () => {
    const liquidityHub = {
      ...liquidityHubs[0],
      yieldGroups: [usdtCentrifugeYieldGroup],
    };

    renderComponent(<YieldGroupList liquidityHub={liquidityHub} />);

    const [centrifugeLabel] = screen.getAllByText('Centrifuge funds');

    expect(screen.queryByText('Janus Henderson AAA CLO Fund')).not.toBeInTheDocument();

    fireEvent.click(centrifugeLabel);

    await waitFor(() =>
      expect(screen.getAllByText('Janus Henderson Anemoy Treasury Fund').length).toBeGreaterThan(1),
    );

    expect(screen.getAllByText('Janus Henderson AAA CLO Fund').length).toBeGreaterThan(1);

    // the name column is labelled per group type
    expect(screen.getAllByText('Fund').length).toBeGreaterThan(0);
    expect(screen.queryByText('Vault')).not.toBeInTheDocument();
    expect(screen.queryByText('Market')).not.toBeInTheDocument();

    // the CRA column shows up because these funds carry agency ratings
    expect(screen.getAllByText('CRA').length).toBeGreaterThan(0);

    // ...while the collateral column stays out, since these funds have no collateral
    expect(screen.queryByText('Collateral')).not.toBeInTheDocument();
  });

  it('omits the CRA column when no fund in the group carries ratings', async () => {
    const liquidityHub = {
      ...liquidityHubs[0],
      yieldGroups: [
        {
          ...usdtCentrifugeYieldGroup,
          sources: usdtCentrifugeYieldGroup.sources.map(source => ({ ...source, ratings: [] })),
        },
      ],
    };

    renderComponent(<YieldGroupList liquidityHub={liquidityHub} />);

    fireEvent.click(screen.getAllByText('Centrifuge funds')[0]);

    await waitFor(() =>
      expect(screen.getAllByText('Janus Henderson Anemoy Treasury Fund').length).toBeGreaterThan(1),
    );

    expect(screen.queryByText('CRA')).not.toBeInTheDocument();
  });
});
