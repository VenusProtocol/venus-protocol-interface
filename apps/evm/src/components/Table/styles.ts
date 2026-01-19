import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import type { BREAKPOINTS } from 'App/MuiThemeProvider/muiTheme';
import type { CSSProperties } from 'react';

type StylesProps = {
  cellHeight?: CSSProperties['height'];
};

export const useStyles = (props?: StylesProps) => {
  const { cellHeight } = props ?? {};

  const theme = useTheme();
  return {
    getRoot: ({ breakpoint }: { breakpoint?: keyof (typeof BREAKPOINTS)['values'] }) => css`
      padding-left: 0;
      padding-right: 0;

      ${breakpoint && theme.breakpoints.down(breakpoint)} {
        background-color: transparent;
        padding-top: 0;
        padding-bottom: 0;
      }
    `,
    getTitle: ({ breakpoint }: { breakpoint?: keyof (typeof BREAKPOINTS)['values'] }) => css`
      margin-bottom: ${theme.spacing(4)};
      padding: ${theme.spacing(0, 6)};

      ${breakpoint && theme.breakpoints.down(breakpoint)} {
        padding: 0;
      }
    `,
    getHeader: ({ breakpoint }: { breakpoint?: keyof (typeof BREAKPOINTS)['values'] }) => css`
      padding: ${theme.spacing(0, 6)};
      
      ${breakpoint && theme.breakpoints.down(breakpoint)} {
        padding: 0;
      }
    `,
    getTableContainer: ({
      breakpoint,
    }: {
      breakpoint?: keyof (typeof BREAKPOINTS)['values'];
    }) => css`
      ${breakpoint && theme.breakpoints.down(breakpoint)} {
        display: none;
      }
    `,
    getCardsContainer: ({
      breakpoint,
    }: {
      breakpoint?: keyof (typeof BREAKPOINTS)['values'];
    }) => css`
      display: none;

      ${breakpoint && theme.breakpoints.down(breakpoint)} {
        display: block;
      }
    `,
    cardsSelect: css`
      width: ${theme.spacing(56)};
      margin-bottom: ${theme.spacing(4)};
    `,
    link: css`
      color: ${theme.palette.text.primary};

      :hover {
        text-decoration: none;
      }
    `,
    tableWrapperMobile: ({ clickable }: { clickable: boolean }) => css`
      &:not(:last-of-type) {
        margin-bottom: ${theme.spacing(4)};
      }

      padding: ${theme.spacing(4, 0)};

      ${
        clickable &&
        css`
        cursor: pointer;

        :hover {
          background-color: ${theme.palette.interactive.hover};
        }
      `
      }
    `,
    getTableRow: ({ clickable }: { clickable: boolean }) => css`
      height: ${theme.spacing(14)};

      :hover {
        background-color: ${theme.palette.interactive.hover} !important;
      }

      ${
        clickable &&
        css`
        cursor: pointer;
      `
      }
    `,
    cellTitleMobile: css`
      color: ${theme.palette.text.secondary};
    `,
    cellValueMobile: css`
      padding-top: ${theme.spacing(2)};
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${theme.palette.text.primary};
    `,
    loader: css`
      margin-bottom: ${theme.spacing(5)};
    `,
    table: ({ minWidth }: { minWidth: string }) => css`
      min-width: ${minWidth};
      table-layout: fixed;

      .MuiTableCell-root {
        border-width: 0;
        font-weight: ${theme.typography.body1.fontWeight};
        flex-direction: row;
        font-size: ${theme.spacing(3.5)};
        text-transform: none;
      }

      .MuiTableCell-root:first-of-type {
        padding-left: ${theme.spacing(6)};
      }

      .MuiTableCell-root:last-child {
        padding-right: ${theme.spacing(6)};
      }
    `,
    tableSortLabel: ({ orderable }: { orderable: boolean }) => css`
      cursor: ${orderable ? 'pointer' : 'auto'};

      &.MuiTableSortLabel-root {
        span {
          color: ${theme.palette.text.secondary};
        }
      }

      span.MuiTableSortLabel-icon {
        display: none;
      }

      .MuiSvgIcon-root {
        display: block;
        margin-left: ${theme.spacing(2)};
        transform: rotate(0deg);
      }
      .MuiTableSortLabel-iconDirectionDesc {
        transform: rotate(180deg);
      }

      &.MuiTableSortLabel-root.Mui-active:hover {
        color: ${theme.palette.text.secondary};
        .MuiTableSortLabel-iconDirectionDesc {
          opacity: 0.5;
        }
        .MuiTableSortLabel-iconDirectionAsc {
          opacity: 0.5;
        }
      }
    `,
    tableSortLabelIconsContainer: css`
      margin-top: -2px;
    `,
    tableSortLabelIcon: ({ active }: { active: boolean }) => css`
      &.MuiTableSortLabel-icon {
        fill: ${theme.palette.text.primary};
      }
      .Mui-active &.MuiTableSortLabel-icon {
        fill: ${active ? theme.palette.interactive.success : theme.palette.text.primary};
        color: ${active ? theme.palette.interactive.success : theme.palette.text.primary};
      }
    `,
    cellWrapper: css`
      height: ${cellHeight ?? '1px'};
      overflow: hidden;
      text-overflow: ellipsis;
      padding: ${theme.spacing(0, 4)};

      :first-of-type > a {
        padding-left: 0;
      }

      :last-of-type > a {
        padding-right: 0;
      }
    `,
  };
};
