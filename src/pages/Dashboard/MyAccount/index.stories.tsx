import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { MyAccount } from '.';

export default {
  title: 'Pages/Dashboard/MyAccount',
  component: MyAccount,
  decorators: [withThemeProvider, withCenterStory({ width: 650 })],
  parameters: {
    backgrounds: {
      default: 'Primary',
    },
  },
} as ComponentMeta<typeof MyAccount>;

export const Default = () => (
  <MyAccount
    netApyPercentage={2493}
    dailyEarningsCents={14829}
    supplyBalanceCents={122889}
    borrowBalanceCents={30243}
    borrowLimitCents={7373}
    borrowLimitUsedPercentage={41}
    safeLimitPercentage={41}
  />
);
