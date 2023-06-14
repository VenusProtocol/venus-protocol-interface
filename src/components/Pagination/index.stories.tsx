/** @jsxImportSource @emotion/react */
import { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';
import React from 'react';

import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import { Pagination } from '.';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  decorators: [withThemeProvider, withCenterStory({ width: 800 })],
  parameters: {
    backgrounds: {
      default: PALETTE.background.default,
    },
  },
} as Meta<typeof Pagination>;

const PaginationTemplate: StoryFn<{
  itemsCount: number;
  itemsPerPageCount?: number;
}> = ({ itemsPerPageCount }) => (
  <Pagination itemsCount={25} onChange={noop} itemsPerPageCount={itemsPerPageCount} />
);

export const PaginationWithCustomContentPerPage = PaginationTemplate.bind({});
PaginationWithCustomContentPerPage.args = {
  itemsCount: 25,
  itemsPerPageCount: 4,
};
