/** @jsxImportSource @emotion/react */
import type { Meta, StoryFn } from '@storybook/react';
import noop from 'noop-ts';

import { PALETTE } from 'App/MuiThemeProvider/muiTheme';

import { Pagination } from '.';

export default {
  title: 'Components/Pagination',
  component: Pagination,
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
