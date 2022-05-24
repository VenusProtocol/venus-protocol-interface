/** @jsxImportSource @emotion/react */
import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
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

const PaginationWithCustomRowsPerPageTemplate: Story<{
  initialPageNumber: number;
  rowsPerPageCount: number;
}> = ({ initialPageNumber, rowsPerPageCount }) => {
  const styles = useTableStyles();
  const data = [...rows, ...rows, ...rows];
  const { pagesCount, activePageIndex, setActivePageIndex, currentPageData, itemsCountString } =
    usePagination<ITableRowProps[]>({
      data,
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
        setActivePageIndex={setActivePageIndex}
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
