import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { ValueUpdate } from '.';

export default {
  title: 'Components/ValueUpdate',
  component: ValueUpdate,
  decorators: [withThemeProvider, withCenterStory({ width: 300 })],
} as ComponentMeta<typeof ValueUpdate>;

export const Increase = () => <ValueUpdate original={200000} update={300000} />;

export const Decrease = () => <ValueUpdate original={500000} update={300000} />;
