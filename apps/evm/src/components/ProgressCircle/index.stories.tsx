import type { Meta } from '@storybook/react';

import { ProgressCircle } from '.';

export default {
  title: 'Components/ProgressCircle',
  component: ProgressCircle,
} as Meta<typeof ProgressCircle>;

export const HealthyProgressCircle = () => (
  <ProgressCircle value={30} strokeWidthPx={3} sizePx={50} />
);
export const WarningProgressCircle = () => (
  <ProgressCircle value={50} strokeWidthPx={3} sizePx={50} />
);
export const DangerProgressCircle = () => (
  <ProgressCircle value={80} strokeWidthPx={3} sizePx={50} />
);
export const FullProgressCircle = () => (
  <ProgressCircle value={100} strokeWidthPx={3} sizePx={50} />
);
