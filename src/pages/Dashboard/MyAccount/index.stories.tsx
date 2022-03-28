import React from 'react';
import { ComponentMeta } from '@storybook/react';
import {
  withThemeProvider,
  withCenterStory,
  withProvider,
  withMarketContext,
  withAuthProvider,
} from 'stories/decorators';
import { MyAccountUi } from '.';

export default {
  title: 'Pages/Dashboard/MyAccount',
  component: MyAccountUi,
  decorators: [
    withProvider,
    withMarketContext,
    withAuthProvider,
    withThemeProvider,
    withCenterStory({ width: 650 }),
  ],
} as ComponentMeta<typeof MyAccountUi>;

export const Default = () => (
  <MyAccountUi
    netApyPercentage={2493}
    dailyEarningsCents={14829}
    supplyBalanceCents={122889}
    borrowBalanceCents={30243}
    borrowLimitCents={7373}
    borrowLimitUsedPercentage={41}
    safeLimitPercentage={41}
    isSwitched
    onSwitch={console.log}
    trackTooltip="Storybook tooltip text for Track"
    markTooltip="Storybook tooltip text for Mark"
  />
);
