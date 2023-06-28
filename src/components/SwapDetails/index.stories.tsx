import { Meta } from '@storybook/react';
import React from 'react';

import { exactAmountInSwap } from '__mocks__/models/swaps';
import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { SwapDetails } from '.';

export default {
  title: 'Components/SwapDetails',
  component: SwapDetails,
  decorators: [withThemeProvider, withCenterStory({ width: 600 })],
} as Meta<typeof SwapDetails>;

export const Default = () => <SwapDetails action="repay" />;

export const Repay = () => <SwapDetails action="repay" swap={exactAmountInSwap} />;

export const Supply = () => <SwapDetails action="supply" swap={exactAmountInSwap} />;
