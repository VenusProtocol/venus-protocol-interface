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
} as ComponentMeta<typeof MyAccount>;

export const Default = () => (
  <MyAccountUi
    netApyPercentage={2493}
    dailyEarningsCents={14829}
    supplyBalanceCents={122889}
    borrowBalanceCents={30243}
    borrowLimitCents={7373}
    safeLimitPercentage={41}
  />
);

export const WithoutValues = () => (
  <MyAccountUi
    netApyPercentage={undefined}
    dailyEarningsCents={undefined}
    supplyBalanceCents={undefined}
    borrowBalanceCents={undefined}
    borrowLimitCents={undefined}
    safeLimitPercentage={undefined}
  />
);
