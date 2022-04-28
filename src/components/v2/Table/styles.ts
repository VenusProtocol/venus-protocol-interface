import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      overflow: hidden;
      padding-left: 0;
      padding-right: 0;
    `,
    title: css`
      margin-bottom: ${theme.spacing(4)};
      padding: ${theme.spacing(0, 6)};
    `,
    table: ({ minWidth }: { minWidth: string }) => css`
      min-width: ${minWidth};

      .MuiTableCell-root {
        border-width: 0;
        font-weight: ${theme.typography.body1.fontWeight};
        text-align: right;
        font-size: ${theme.spacing(3.5)};
        display: inline-flex;
        justify-content: flex-end;
        align-items: center;
      }

      .MuiTableRow-root {
        display: grid;
        cursor: pointer;
      }

      .MuiTableCell-root:first-child {
        padding-left: ${theme.spacing(6)};
        text-align: left;
        justify-content: flex-start;
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
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    cellInner: css`
      text-overflow: ellipsis;
    `,

    getTemplateColumns: ({ gridStyles }: { gridStyles: string }) => css`
      grid-template-columns: ${gridStyles};
    `,
  };
};
