import React from 'react';
import { ComponentMeta } from '@storybook/react';

import noop from 'noop-ts';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import MyAccountUi from './MyAccountUi';

export default {
  title: 'Pages/Dashboard/MyAccount',
  component: MyAccountUi,
  decorators: [withThemeProvider, withCenterStory({ width: 650 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MyAccountUi>;

export const Default = () => (
  <MyAccountUi
    netApyPercentage={24.93}
    dailyEarningsCents={1482}
    supplyBalanceCents={122889}
    borrowBalanceCents={30243}
    borrowLimitCents={73730}
    safeBorrowLimitPercentage={65}
    onXvsToggle={noop}
    withXvs
  />
);

export const WithZeroValues = () => (
  <MyAccountUi
    netApyPercentage={0}
    dailyEarningsCents={0}
    supplyBalanceCents={0}
    borrowBalanceCents={0}
    borrowLimitCents={0}
    safeBorrowLimitPercentage={65}
    onXvsToggle={noop}
    withXvs={false}
  />
);

export const WithoutUndefinedValues = () => (
  <MyAccountUi
    netApyPercentage={undefined}
    dailyEarningsCents={undefined}
    supplyBalanceCents={undefined}
    borrowBalanceCents={undefined}
    borrowLimitCents={undefined}
    safeBorrowLimitPercentage={65}
    onXvsToggle={noop}
    withXvs={false}
  />
);
