import type { Meta } from '@storybook/react';

import { ButtonGroup } from '.';

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
} as Meta<typeof ButtonGroup>;

export const Default = () => (
  <ButtonGroup
    buttonLabels={['Button 1', 'Button 2']}
    onButtonClick={console.log}
    activeButtonIndex={0}
  />
);

export const WithFullWidth = () => (
  <ButtonGroup
    buttonLabels={['Button 1', 'Button 2']}
    onButtonClick={console.log}
    activeButtonIndex={0}
    fullWidth
  />
);
