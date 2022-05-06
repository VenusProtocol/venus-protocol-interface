import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import { Select } from '.';

export default {
  title: 'Components/Select',
  component: Select,
  decorators: [withCenterStory({ width: 200 })],
  parameters: {
    backgrounds: {
      default: '#1F2028',
    },
  },
} as ComponentMeta<typeof Select>;

const options = Array.from(Array(5).keys()).map(i => ({
  value: `value${i}`,
  label: `Value${i}`,
}));

export const Default = () => <Select options={options} />;
