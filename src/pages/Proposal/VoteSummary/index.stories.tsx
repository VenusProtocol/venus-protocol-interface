import { Meta } from '@storybook/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { VoteSupport } from 'types';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import VoteSummary from './index';

export default {
  title: 'Pages/Proposal/Components/VoteSummary',
  component: VoteSummary,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
} as Meta<typeof VoteSummary>;

const votes = [
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c2976',
    votesMantissa: new BigNumber('1000'),
    reason: 'comment text from storybook',
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c297s',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c297q',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74b2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41dea391b74c2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de23d1b74c2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de23a1b74c2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b7qc2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2v91b74c2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41dn2391b74c2977',
    votesMantissa: new BigNumber('1271'),
    support: VoteSupport.For,
    blockNumber: 33477068,
    blockTimestamp: new Date(1695128102),
  },
];

export const VoteFor = () => (
  <VoteSummary
    label="For"
    votedValueMantissa={new BigNumber('100000000000000000')}
    votedTotalMantissa={new BigNumber('200000000000000000')}
    voters={votes}
    progressBarColor={PALETTE.interactive.success50}
    votingEnabled
    openVoteModal={noop}
  />
);

export const VoteAgainst = () => (
  <VoteSummary
    label="Against"
    votedValueMantissa={new BigNumber('100000000000000000')}
    votedTotalMantissa={new BigNumber('200000000000000000')}
    voters={votes}
    progressBarColor={PALETTE.interactive.error50}
    votingEnabled
    openVoteModal={noop}
  />
);

export const Abstain = () => (
  <VoteSummary
    label="Abstain"
    votedValueMantissa={new BigNumber('0')}
    votedTotalMantissa={new BigNumber('200000000000000000')}
    progressBarColor={PALETTE.text.secondary}
    votingEnabled
    openVoteModal={noop}
  />
);
