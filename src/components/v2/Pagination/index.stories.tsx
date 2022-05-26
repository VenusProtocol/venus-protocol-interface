/** @jsxImportSource @emotion/react */
import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
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
} as ComponentMeta<typeof Pagination>;

const PaginationTemplate: Story<{
  itemsCount: number;
  initialPageNumber?: number;
  itemsPerPageCount?: number;
}> = ({ initialPageNumber, itemsPerPageCount }) => (
  <Pagination
    itemsCount={25}
    onChange={console.log}
    initialPageNumber={initialPageNumber}
    itemsPerPageCount={itemsPerPageCount}
  />
);

export const PaginationWithCustomContentPerPage = PaginationTemplate.bind({});
PaginationWithCustomContentPerPage.args = {
  itemsCount: 25,
  initialPageNumber: 1,
  itemsPerPageCount: 4,
};
