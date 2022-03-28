import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { MyAccount } from '.';

export default {
  title: 'Components/MyAccount',
  component: MyAccount,
  decorators: [withThemeProvider, withCenterStory({ width: 'calc(100 - 32px)' })],
} as ComponentMeta<typeof MyAccount>;

export const MyAccountDefault = () => (
  <MyAccount
    netApyPercentage={24.93}
    dailyEarningsCents={14.829}
    supplyBalanceCents={122.889}
    borrowBalanceCents={30.243}
    borrowLimitCents={73.73}
    borrowLimitUsedPercentage={41}
    safeLimitPercentage={41}
  />
);
