import type { Meta } from '@storybook/react';

import { ProgressBar } from '.';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
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
    tooltip="Storybook tooltip text"
  />
);

export const InvalidProgressBar = () => (
  <ProgressBar value={90} step={10} mark={75} ariaLabel="Storybook slider" min={0} max={100} />
);
