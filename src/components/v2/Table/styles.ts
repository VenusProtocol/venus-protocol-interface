import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    title: css`
      margin-bottom: ${theme.spacing(6)};
      padding: ${theme.spacing(0, 6)};
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
        font-weight: ${theme.typography.body1.fontWeight};
        text-align: right;
        font-size: 14px;
      }

      .MuiTableRow-root {
        cursor: pointer;
      }

      .MuiTableCell-root:first-child {
        padding-left: ${theme.spacing(6)};
        text-align: left;
        max-width: 110px;
      }

      .MuiTableCell-root:nth-child(2) {
        max-width: 100px;
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
      max-width: 115px;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    cellInner: css`
      text-overflow: ellipsis;
    `,
  };
};
