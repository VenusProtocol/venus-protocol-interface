import type { Meta } from '@storybook/react';

import { ProgressBar } from '.';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
} as Meta<typeof ProgressBar>;

export const ValidProgressBar = () => (
  <ProgressBar progressBars={[{ value: 50 }]} marks={[{ value: 75 }]} min={0} max={100} />
);

export const ProgressBarWithCustomProgressColor = () => (
  <ProgressBar
    progressBars={[{ value: 50, className: 'bg-warning' }]}
    marks={[{ value: 75 }]}
    min={0}
    max={100}
  />
);

export const MultipleProgressBars = () => (
  <ProgressBar
    progressBars={[
      { value: 80, className: 'bg-warning' },
      { value: 50, className: 'bg-success' },
    ]}
    min={0}
    max={100}
  />
);

export const ValidProgressBarWithTooltip = () => (
  <ProgressBar
    progressBars={[{ value: 50 }]}
    marks={[{ value: 75 }]}
    min={0}
    max={100}
    tooltip="Storybook tooltip text"
  />
);
