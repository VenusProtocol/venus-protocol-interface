import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { ProgressCircle } from '.';

export default {
  title: 'Components/ProgressCircle',
  component: ProgressCircle,
  decorators: [withCenterStory({ width: 600 })],
} as ComponentMeta<typeof ProgressCircle>;

export const HealthyProgressCircle = () => <ProgressCircle value={30} />;
export const WarningProgressCircle = () => <ProgressCircle value={50} />;
export const DangerProgressCircle = () => <ProgressCircle value={80} />;
export const FullProgressCircle = () => <ProgressCircle value={100} />;
