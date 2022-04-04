import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { LabeledInlineValue } from '.';

export default {
  title: 'Components/LabeledInlineValue',
  component: LabeledInlineValue,
  decorators: [withThemeProvider, withCenterStory({ width: 450 })],
} as ComponentMeta<typeof LabeledInlineValue>;

export const Default = () => <LabeledInlineValue label="Available VAI LIMIT" value="2000 VAI" />;

export const WithIcon = () => (
  <LabeledInlineValue label="Available VAI LIMIT" iconName="vai" value="2000 VAI" />
);
