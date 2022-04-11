import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { Delimiter } from '.';

export default {
  title: 'Components/Delimiter',
  component: Delimiter,
  decorators: [withThemeProvider, withCenterStory({ width: 650 })],
} as ComponentMeta<typeof Delimiter>;

export const Default = () => (
  <>
    Some text
    <Delimiter />
    and some more text
  </>
);
