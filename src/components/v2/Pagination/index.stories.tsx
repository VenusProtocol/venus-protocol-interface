/** @jsxImportSource @emotion/react */
import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import Typography from '@mui/material/Typography';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
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

const tableData = [...rows, ...rows, ...rows];

const PaginationWithCustomRowsPerPageTemplate: Story<{
  initialPageNumber: number;
  rowsPerPageCount: number;
}> = ({ initialPageNumber, rowsPerPageCount }) => {
  const styles = useTableStyles();
  const { pagesCount, activePageIndex, goToPageByIndex, currentPageData, itemsCountString } =
    usePagination<ITableRowProps[]>({
      data: tableData,
      initialPageNumber,
      rowsPerPageCount,
    });

  return (
    <>
      {/* Table component is here just for displaying the hook usePagination usage */}
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
      <Pagination
        pagesCount={pagesCount}
        activePageIndex={activePageIndex}
        goToPageByIndex={goToPageByIndex}
        itemsCountString={itemsCountString}
      />
    </>
  );
};

const PaginationForNonTableComponent: Story<{
  initialPageNumber: number;
  pagesToCreateCount: number;
  rowsPerPageCount: number;
}> = ({ initialPageNumber, rowsPerPageCount = 1, pagesToCreateCount = 10 }) => {
  const data = Array.from({ length: pagesToCreateCount }, (_, i) => `random page ${i + 1} data`);

  const { pagesCount, activePageIndex, goToPageByIndex, currentPageData, itemsCountString } =
    usePagination<string>({
      data,
      initialPageNumber,
      rowsPerPageCount,
    });

  const handleGoToPageClick = (newPageIndex: number) => {
    /* do something on change page action */
    goToPageByIndex(newPageIndex);
  };

  return (
    <>
      {/* example with custom content */}
      <Typography align="center">{currentPageData}</Typography>
      <Pagination
        pagesCount={pagesCount}
        activePageIndex={activePageIndex}
        goToPageByIndex={handleGoToPageClick}
        itemsCountString={itemsCountString}
      />
    </>
  );
};

export const PaginationWithCustomRowsPerPage = PaginationWithCustomRowsPerPageTemplate.bind({});
PaginationWithCustomRowsPerPage.args = {
  initialPageNumber: 1,
  rowsPerPageCount: 3,
};

export const PaginationWithCustomContentPerPage = PaginationForNonTableComponent.bind({});
PaginationWithCustomContentPerPage.args = {
  initialPageNumber: 1,
  rowsPerPageCount: 1,
  pagesToCreateCount: 10,
};
