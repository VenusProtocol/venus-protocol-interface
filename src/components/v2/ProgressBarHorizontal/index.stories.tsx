import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { ProgressBarHorizontal } from '.';

export default {
  title: 'Components/ProgressBarHorizontal',
  component: ProgressBarHorizontal,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof ProgressBarHorizontal>;

export const ValidProgressBar = () => (
  <ProgressBarHorizontal
    value={50}
    step={5}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
  />
);

export const ValidProgressBarWithTooltip = () => (
  <ProgressBarHorizontal
    value={50}
    step={5}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
    trackTooltip="Storybook tooltip text for Track"
    markTooltip="Storybook tooltip text for Mark"
    isDisabled
  />
);

export const InvalidProgressBar = () => (
  <ProgressBarHorizontal
    value={90}
    step={10}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
  />
);
