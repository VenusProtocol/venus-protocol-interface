import React from 'react';
import { ComponentMeta } from '@storybook/react';

import { withThemeProvider, withCenterStory } from 'stories/decorators';
import { Token } from '.';

export default {
  title: 'Components/Token',
  component: Token,
  decorators: [withThemeProvider, withCenterStory({ width: 100 })],
} as ComponentMeta<typeof Token>;

export const Default = () => <Token symbol="xvs" />;
