import Typography from '@mui/material/Typography';
import { Meta } from '@storybook/react';
import React from 'react';

import { withCenterStory } from 'stories/decorators';

import { Tooltip } from '.';

export default {
  title: 'components/Tooltip',
  component: Tooltip,
  decorators: [withCenterStory({ width: 200 })],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as Meta<typeof Tooltip>;

export const TooltipDefault = () => (
  <Tooltip title="hello from tooltip" open>
    <Typography display="inline-flex">Hello from storybook</Typography>
  </Tooltip>
);
