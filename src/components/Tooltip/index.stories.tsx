import Typography from '@mui/material/Typography';
import { ComponentMeta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

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
