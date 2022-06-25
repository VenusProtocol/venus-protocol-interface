import React from 'react';
import renderComponent from 'testUtils/renderComponent';
import voterAccounts from '__mocks__/models/voterAccounts';
import Table from '.';

describe('pages/VoterLeaderboard/Table', () => {
  beforeAll(() => {
    jest.mock('clients/api');
  });

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
