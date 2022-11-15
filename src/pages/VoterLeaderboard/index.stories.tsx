import { ComponentMeta } from '@storybook/react';
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
} as ComponentMeta<typeof VoterLeaderboardUi>;

const getVoterAccountsOutput = formatVoterAccountResponse(voterAccountsResponse.data);

export const Default = () => (
  <VoterLeaderboardUi {...getVoterAccountsOutput} isFetching={false} setCurrentPage={noop} />
);
