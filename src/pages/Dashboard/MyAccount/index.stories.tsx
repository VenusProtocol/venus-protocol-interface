import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { MyAccountUi } from '.';

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
    safeLimitPercentage={65}
  />
);

export const WithoutValues = () => (
  <MyAccountUi
    netApyPercentage={undefined}
    dailyEarningsCents={undefined}
    supplyBalanceCents={undefined}
    borrowBalanceCents={undefined}
    borrowLimitCents={undefined}
    safeLimitPercentage={65}
  />
);
