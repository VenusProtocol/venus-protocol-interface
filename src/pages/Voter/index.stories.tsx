import { ComponentMeta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import voterDetails from '__mocks__/models/voterDetails';
import voterHistory from '__mocks__/models/voterHistory';
import { NULL_ADDRESS } from 'constants/address';
import { withRouter } from 'stories/decorators';

import { VoterUi } from '.';

export default {
  title: 'Pages/Voter',
  component: VoterUi,
  decorators: [withRouter],
} as ComponentMeta<typeof VoterUi>;

export const Default = () => (
  <VoterUi
    balanceWei={new BigNumber(912512333)}
    delegateCount={12}
    votesWei={new BigNumber(912512333)}
    delegating
    voterTransactions={voterDetails.voterTransactions}
    address={NULL_ADDRESS}
    voterHistory={voterHistory.voterHistory}
    setCurrentPage={noop}
    total={60}
    limit={6}
    isHistoryFetching={false}
  />
);
