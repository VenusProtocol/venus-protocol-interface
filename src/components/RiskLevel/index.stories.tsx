import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { RiskLevel } from '.';

export default {
  title: 'Components/RiskLevel',
  component: RiskLevel,
  decorators: [withThemeProvider, withCenterStory({ width: 500 })],
} as ComponentMeta<typeof RiskLevel>;

export const Low = () => <RiskLevel variant="low" />;
export const Medium = () => <RiskLevel variant="medium" />;
export const High = () => <RiskLevel variant="high" />;
