import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { routes } from 'constants/routing';
import { VBEP_TOKENS } from 'constants/tokens';
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
    routes.pools.path,
    routes.pool.path.replace(':poolId', 'FAKE_MARKET_ID'),
    routes.market.path
      .replace(':poolId', 'FAKE_MARKET_ID')
      .replace(':vTokenAddress', VBEP_TOKENS.xvs.address),
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
