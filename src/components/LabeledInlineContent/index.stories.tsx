import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { LabeledInlineContent } from '.';

export default {
  title: 'Components/LabeledInlineContent',
  component: LabeledInlineContent,
  decorators: [withCenterStory({ width: 450 })],
} as ComponentMeta<typeof LabeledInlineContent>;

export const Default = () => (
  <LabeledInlineContent label="Available VAI LIMIT">2000 VAI</LabeledInlineContent>
);

export const WithIcon = () => (
  <LabeledInlineContent label="Available VAI LIMIT" iconName="vai">
    2000 VAI
  </LabeledInlineContent>
);

export const WithInvertedTextColors = () => (
  <LabeledInlineContent label="Available VAI LIMIT" iconName="vai" invertTextColors>
    2000 VAI
  </LabeledInlineContent>
);
