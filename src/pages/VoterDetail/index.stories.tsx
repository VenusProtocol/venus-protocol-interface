import React from 'react';
import BigNumber from 'bignumber.js';
import { ComponentMeta } from '@storybook/react';
import { withRouter } from 'stories/decorators';
import { VoterDetailUi } from '.';

export default {
  title: 'Pages/VoterDetail',
  component: VoterDetailUi,
  decorators: [withRouter],
} as ComponentMeta<typeof VoterDetailUi>;

export const Default = () => (
  <VoterDetailUi
    balanceWei={new BigNumber(912512333)}
    delegateCount={12}
    votesWei={new BigNumber(912512333)}
    delegating
  />
);
