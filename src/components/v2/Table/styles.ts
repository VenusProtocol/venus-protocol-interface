import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    title: css`
      margin-bottom: ${theme.spacing(3)};
      padding: ${theme.spacing(0, 3)};
    `,
    tableContainer: css`
      background-color: transparent;
      background-image: none;
      box-shadow: none;
    `,
    table: ({ minWidth }: { minWidth: string }) => css`
      min-width: ${minWidth};
      .MuiTableCell-root {
        border-width: 0;
      }

      .MuiTableCell-root:first-child {
        padding-left: ${theme.spacing(3)};
      }

      .MuiTableCell-root:last-child {
        padding-right: ${theme.spacing(3)};
      }
    `,
    tableSortLabel: css`
      &.MuiTableSortLabel-root {
        span {
          color: ${theme.palette.text.secondary};
        }
      }
      .MuiSvgIcon-root {
        display: block;
        margin-right: ${theme.spacing(1)};
        margin-left: ${theme.spacing(1)};
        transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
          transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
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
    tableSortLabelIcon: ({ active }: { active: boolean }) => css`
      &.MuiTableSortLabel-icon {
        fill: ${theme.palette.text.primary};
      }
      .Mui-active &.MuiTableSortLabel-icon {
        fill: ${active ? theme.palette.success.slider : theme.palette.text.primary};
        color: ${active ? theme.palette.success.slider : theme.palette.text.primary};
      }
    `,
    tableRow: css`
      padding: ${theme.spacing(0, 2)};
    `,
  };
};
