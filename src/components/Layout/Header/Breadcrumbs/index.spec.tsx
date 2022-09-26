import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { routes } from 'constants/routing';
import { MuiThemeProvider } from 'theme/MuiThemeProvider';

import Breadcrumbs from '.';

describe('component/Layout/Header/Breadcrumbs', () => {
  it.each([
    routes.dashboard.path,
    routes.account.path,
    routes.governance.path,
    routes.governanceLeaderBoard.path,
    routes.governanceProposal.path.replace(':proposalId', 'FAKE_PROPOSAL_ID'),
    routes.governanceVoter.path.replace(':address', 'FAKE_VOTER_ADDRESS'),
    routes.history.path,
    routes.markets.path,
    routes.market.path.replace(':marketId', 'FAKE_MARKET_ID'),
    routes.marketAsset.path
      .replace(':marketId', 'FAKE_MARKET_ID')
      .replace(':vTokenId', 'FAKE_V_TOKEN_ID'),
    routes.xvs.path,
    routes.vai.path,
    routes.vaults.path,
    routes.convertVrt.path,
  ])('outputs the right DOM based on the current path', async pathname => {
    const { container } = render(
      <MuiThemeProvider>
        <MemoryRouter initialEntries={[pathname]}>
          <Breadcrumbs />
        </MemoryRouter>
      </MuiThemeProvider>,
    );

    expect(container.textContent).toMatchSnapshot();
  });
});
