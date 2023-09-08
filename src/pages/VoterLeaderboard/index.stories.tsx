import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import voterAccountsResponse from '__mocks__/api/voterAccounts.json';
import formatVoterAccountResponse from 'clients/api/queries/getVoterAccounts/formatVoterAccountResponse';
import { withRouter } from 'stories/decorators';

import { VoterLeaderboardUi } from '.';

export default {
  title: 'Pages/VoterLeaderboard',
  component: VoterLeaderboardUi,
  decorators: [withRouter],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as Meta<typeof VoterLeaderboardUi>;

const getVoterAccountsOutput = formatVoterAccountResponse({
  data: voterAccountsResponse,
  totalStakedXvs: voterAccountsResponse.result.reduce(
    (acc, v) => acc.plus(new BigNumber(v.votesMantissa)),
    new BigNumber(0),
  ),
});

export const Default = () => (
  <VoterLeaderboardUi {...getVoterAccountsOutput} isFetching={false} setCurrentPage={noop} />
);
