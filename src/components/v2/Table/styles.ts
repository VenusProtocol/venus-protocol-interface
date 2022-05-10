import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      overflow: hidden;
      padding-left: 0;
      padding-right: 0;

      ${theme.breakpoints.down('sm')} {
        padding-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
      }
    `,
    rootMobile: css`
      background-color: transparent;
    `,
    title: css`
      margin-bottom: ${theme.spacing(4)};
      padding: ${theme.spacing(0, 6)};
    `,
    titleMobile: css`
      padding: 0;
    `,
    tableWrapperMobile: css`
      margin-top: ${theme.spacing(6)};
      padding: ${theme.spacing(4, 0, 2)};
    `,
    rowTitleMobile: css`
      padding-left: ${theme.spacing(4)};
      padding-right: ${theme.spacing(4)};
    `,
    delimiterMobile: css`
      margin: ${theme.spacing(4)};
    `,
    rowWrapperMobile: css`
      display: grid;

      /* grid-template-columns and grid-template-rows for this block is set by props */
    `,
    cellMobile: css`
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-left: ${theme.spacing(4)};
      padding-right: ${theme.spacing(4)};
    `,
    columnLabelMobile: css`
      font-size: ${theme.spacing(3)};
    `,
    cellValueMobile: css`
      padding-top: ${theme.spacing(2)};
      padding-bottom: ${theme.spacing(2)};
      overflow: hidden;
      text-overflow: ellipsis;
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
        text-transform: none;
      }

      .MuiTableRow-root {
        display: grid;
        cursor: pointer;
      }

      .MuiTableCell-root:first-of-type {
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
    getTemplateColumns: ({ gridColumns }: { gridColumns: string }) => css`
      grid-template-columns: ${gridColumns};
    `,

    getTemplateRows: ({ gridRows }: { gridRows: string }) => css`
      grid-template-rows: ${gridRows};
    `,
  };
};
