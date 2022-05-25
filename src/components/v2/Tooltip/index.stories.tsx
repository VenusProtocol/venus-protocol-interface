import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { withCenterStory } from 'stories/decorators';
import Typography from '@mui/material/Typography';
import { Tooltip } from '.';

export default {
  title: 'Tooltip',
  component: Tooltip,
  decorators: [withCenterStory({ width: 200 })],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Tooltip>;

export const TooltipDefault = () => (
  <Tooltip title="hello from tooltip" open>
    <Typography display="inline-flex">Hello from storybook</Typography>
  </Tooltip>
);
