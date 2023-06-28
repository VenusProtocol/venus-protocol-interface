import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { LabeledProgressBar } from '.';

export default {
  title: 'Components/ProgressBar/LabeledProgressBar',
  component: LabeledProgressBar,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof LabeledProgressBar>;

export const BorrowBalanceAccountHealthWithValues = () => (
  <LabeledProgressBar
    greyLeftText="Max:"
    whiteLeftText="$5000"
    greyRightText="Minimum:"
    whiteRightText="$100"
    value={50}
    step={5}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
  />
);
