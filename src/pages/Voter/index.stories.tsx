import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import voterHistory from '__mocks__/models/voterHistory';
import votes from '__mocks__/models/voters';
import { NULL_ADDRESS } from 'constants/address';
import { withRouter } from 'stories/decorators';

import { VoterUi } from '.';

export default {
  title: 'Pages/Voter',
  component: VoterUi,
  decorators: [withRouter],
} as Meta<typeof VoterUi>;

export const Default = () => (
  <VoterUi
    balanceMantissa={new BigNumber(912512333)}
    delegateCount={12}
    votesMantissa={new BigNumber(912512333)}
    delegating
    latestVotes={votes.result}
    address={NULL_ADDRESS}
    voterHistory={voterHistory.voterHistory}
    setCurrentPage={noop}
    total={60}
    limit={6}
    isHistoryFetching={false}
  />
);
