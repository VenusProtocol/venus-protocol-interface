import type { Meta } from '@storybook/react';

import { LabeledProgressBar } from '.';

export default {
  title: 'Components/ProgressBar/LabeledProgressBar',
  component: LabeledProgressBar,
} as Meta<typeof LabeledProgressBar>;

export const Default = () => (
  <LabeledProgressBar
    greyLeftText="Max:"
    whiteLeftText="$5000"
    greyRightText="Minimum:"
    whiteRightText="$100"
    progressBars={[{ value: 50 }]}
    marks={[{ value: 75 }]}
    min={0}
    max={100}
  />
);
