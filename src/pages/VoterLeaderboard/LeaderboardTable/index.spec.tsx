import voterAccounts from '__mocks__/models/voterAccounts';
import renderComponent from 'testUtils/renderComponent';

import Table from '.';

describe('pages/VoterLeaderboard/Table', () => {
  it('renders without crashing', async () => {
    renderComponent(
      <Table
        voterAccounts={voterAccounts.voterAccounts}
        offset={voterAccounts.offset}
        isFetching={false}
      />,
    );
  });
});
