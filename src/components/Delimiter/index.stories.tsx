import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';

import { Delimiter } from '.';

export default {
  title: 'Components/Delimiter',
  component: Delimiter,
  decorators: [withThemeProvider, withCenterStory({ width: 650 })],
} as Meta<typeof Delimiter>;

export const Default = () => (
  <>
    Some text
    <Delimiter />
    and some more text
  </>
);
