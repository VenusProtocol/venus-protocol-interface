import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withThemeProvider } from 'stories/decorators';
import { Icon } from '.';

export default {
  title: 'Icon',
  component: Icon,
  decorators: [withThemeProvider],
} as ComponentMeta<typeof Icon>;

export const IconDefault = () => <Icon name="mask" />;
