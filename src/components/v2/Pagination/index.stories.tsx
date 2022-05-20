/** @jsxImportSource @emotion/react */
import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import { Table } from '../Table';
import { ITableRowProps } from '../Table/types';
import { columns, rows, useTableStyles } from '../Table/storiesUtils';

import { usePagination } from './usePagination';
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

const PaginationWithCustomRowsPerPageTemplate: Story<{
  initialPageNumber: number;
  rowsPerPageCount: number;
}> = ({ initialPageNumber, rowsPerPageCount }) => {
  const styles = useTableStyles();
  const data = [...rows, ...rows, ...rows];
  const { pagesCount, currentPageIndex, setCurrentPageIndex, currentPageData, itemsCountString } =
    usePagination<ITableRowProps[]>({
      data,
      initialPageNumber,
      rowsPerPageCount,
    });

  return (
    <>
      <Table
        columns={columns}
        data={currentPageData}
        title="Market Data"
        minWidth="650px"
        rowKeyIndex={0}
        tableCss={styles.tableCss}
        cardsCss={styles.cardsCss}
        css={styles.table}
      />
      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
        <Typography mr={2}>{itemsCountString}</Typography>
        <Pagination
          activePageIndex={currentPageIndex}
          pagesCount={pagesCount}
          setCurrentPageIndex={setCurrentPageIndex}
        />
      </Box>
    </>
  );
};

export const PaginationWithCustomRowsPerPage = PaginationWithCustomRowsPerPageTemplate.bind({});
PaginationWithCustomRowsPerPage.args = {
  initialPageNumber: 1,
  rowsPerPageCount: 3,
};
