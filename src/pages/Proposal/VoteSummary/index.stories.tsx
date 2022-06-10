import React from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { VoteSummary } from './index';

export default {
  title: 'Pages/Proposal/VoteSummary',
  component: VoteSummary,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
  parameters: {
    backgrounds: {
      default: 'Default',
    },
  },
} as ComponentMeta<typeof VoteSummary>;

const votes = [
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c2976',
    voteWeightWei: new BigNumber('1000'),
    comment: 'comment text from storybook',
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c2977',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c297s',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74c297q',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b74b2977',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41dea391b74c2977',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de23d1b74c2977',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de23a1b74c2977',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2391b7qc2977',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41de2v91b74c2977',
    voteWeightWei: new BigNumber('1271'),
  },
  {
    address: '0x33AAb7ED8C71C6910Fb4A9bc41dn2391b74c2977',
    voteWeightWei: new BigNumber('1271'),
  },
];

export const VoteFor = () => (
  <VoteSummary
    votedForWei={new BigNumber('100000000000000000')}
    votedTotalWei={new BigNumber('200000000000000000')}
    votesFrom={votes}
    onClick={noop}
  />
);

export const VoteAgainst = () => (
  <VoteSummary
    votedAgainstWei={new BigNumber('100000000000000000')}
    votedTotalWei={new BigNumber('200000000000000000')}
    votesFrom={votes}
    onClick={noop}
  />
);

export const Empty = () => (
  <VoteSummary
    votedForWei={new BigNumber('100000000000000000')}
    votedTotalWei={new BigNumber('200000000000000000')}
    onClick={noop}
  />
);
