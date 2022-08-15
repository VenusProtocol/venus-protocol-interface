import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { RiskLevel } from '.';

export default {
  title: 'Components/RiskLevel',
  component: RiskLevel,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
} as ComponentMeta<typeof RiskLevel>;

export const Minimal = () => <RiskLevel variant="MINIMAL" />;
export const Low = () => <RiskLevel variant="LOW" />;
export const Medium = () => <RiskLevel variant="MEDIUM" />;
export const High = () => <RiskLevel variant="HIGH" />;
export const VeryHigh = () => <RiskLevel variant="VERY_HIGH" />;
