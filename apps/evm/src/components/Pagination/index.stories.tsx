import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { PALETTE } from 'App/MuiThemeProvider/muiTheme';
import { PAGE_PARAM_DEFAULT_KEY } from 'hooks/useUrlPagination';

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

interface PaginationTemplateProps {
  page: number;
  itemsCount: number;
  itemsPerPageCount?: number;
}

const PaginationTemplate: StoryFn<PaginationTemplateProps> = ({
  page,
  itemsCount,
  itemsPerPageCount,
}) => {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      currentSearchParams => {
        currentSearchParams.set(PAGE_PARAM_DEFAULT_KEY, String(page));
        return currentSearchParams;
      },
      { replace: true },
    );
  }, [page, setSearchParams]);

  return (
    <Pagination
      itemsCount={itemsCount}
      onChange={newPageIndex => {
        setSearchParams(
          currentSearchParams => {
            currentSearchParams.set(PAGE_PARAM_DEFAULT_KEY, String(newPageIndex + 1));
            return currentSearchParams;
          },
          { replace: true },
        );
      }}
      itemsPerPageCount={itemsPerPageCount}
    />
  );
};

export const FirstPage = PaginationTemplate.bind({});
FirstPage.args = {
  page: 1,
  itemsCount: 25,
  itemsPerPageCount: 4,
};

export const MiddlePage = PaginationTemplate.bind({});
MiddlePage.args = {
  page: 4,
  itemsCount: 25,
  itemsPerPageCount: 4,
};

export const LastPage = PaginationTemplate.bind({});
LastPage.args = {
  page: 7,
  itemsCount: 25,
  itemsPerPageCount: 4,
};

export const MobileWrapping = PaginationTemplate.bind({});
MobileWrapping.args = {
  page: 4,
  itemsCount: 250,
  itemsPerPageCount: 4,
};
