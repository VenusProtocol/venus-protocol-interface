import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { ProgressBar } from '.';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  decorators: [withCenterStory({ width: 600 })],
} as Meta<typeof ProgressBar>;

export const ValidProgressBar = () => (
  <ProgressBar value={50} step={5} mark={75} ariaLabel="Storybook slider" min={0} max={100} />
);

export const ProgressBarWithCustomProgressColor = () => (
  <ProgressBar
    progressBarColor="yellow"
    value={50}
    step={5}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
  />
);

export const ValidProgressBarWithTooltip = () => (
  <ProgressBar
    value={50}
    step={5}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
    trackTooltip="Storybook tooltip text for Track"
    markTooltip="Storybook tooltip text for Mark"
  />
);

export const InvalidProgressBar = () => (
  <ProgressBar value={90} step={10} mark={75} ariaLabel="Storybook slider" min={0} max={100} />
);

export const SecondaryValueProgressBar = () => (
  <ProgressBar
    value={40}
    secondaryValue={70}
    step={10}
    mark={75}
    ariaLabel="Storybook slider"
    min={0}
    max={100}
  />
);

export const SecondaryValueOverProgressBar = () => (
  <ProgressBar
    value={40}
    secondaryValue={80}
    step={10}
    mark={75}
    ariaLabel="Storybook slider"
    trackTooltip="Storybook tooltip text for Track"
    markTooltip="Storybook tooltip text for Mark"
    min={0}
    max={100}
  />
);
