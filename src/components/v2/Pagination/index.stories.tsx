import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { withThemeProvider, withCenterStory } from 'stories/decorators';
import Typography from '@mui/material/Typography';
import { Pagination } from '.';
import { Table } from '../Table';
import { columns, rows, useTableStyles } from '../Table/index.stories';
import { ITableRowProps } from '../Table/types';
import { usePagination } from './usePagination';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  decorators: [withThemeProvider, withCenterStory({ width: 800 })],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Pagination>;

const PaginationWithCustomRowsPerPageTemplate: Story<{ rowsPerPageCount: number }> = ({
  rowsPerPageCount,
}) => {
  const styles = useTableStyles();
  const data = [...rows, ...rows, ...rows];

  const { pagesCount, currentPageIndex, setCurrentPageIndex, currentPageData, itemsCountString } =
    usePagination<ITableRowProps[]>({
      data,
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
      <Typography>{itemsCountString}</Typography>
      <Pagination
        activePageIndex={currentPageIndex}
        pagesCount={pagesCount}
        setCurrentPageIndex={setCurrentPageIndex}
      />
    </>
  );
};

export const PaginationWithCustomRowsPerPage = PaginationWithCustomRowsPerPageTemplate.bind({});
PaginationWithCustomRowsPerPage.args = {
  rowsPerPageCount: 3,
};
