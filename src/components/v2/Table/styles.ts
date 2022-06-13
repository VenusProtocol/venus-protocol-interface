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
        background-color: transparent;
        padding-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
      }
    `,
    title: css`
      margin-bottom: ${theme.spacing(4)};
      padding: ${theme.spacing(0, 6)};
      ${theme.breakpoints.down('sm')} {
        padding: 0;
      }
    `,
    tableWrapperMobile: ({ clickable }: { clickable: boolean }) => css`
      &:not(:first-of-type) {
        margin-top: ${theme.spacing(6)};
      }

      padding: ${theme.spacing(4, 0)};
      ${clickable &&
      `
        cursor: pointer;
        :hover {
          background-color: ${theme.palette.interactive.hover};
        }
      `}
    `,
    rowTitleMobile: css`
      padding-left: ${theme.spacing(4)};
      padding-right: ${theme.spacing(4)};
    `,
    delimiterMobile: css`
      margin: ${theme.spacing(4)};
    `,
    getTableRow: ({ clickable }: { clickable: boolean }) => css`
      ${clickable &&
      css`
        cursor: pointer;
      `}
    `,
    rowWrapperMobile: css`
      display: grid;
      grid-template-rows: 1fr;
    `,
    cellMobile: css`
      display: flex;
      flex-direction: column;
      padding-left: ${theme.spacing(4)};
      padding-right: ${theme.spacing(4)};
    `,
    columnLabelMobile: css`
      font-size: ${theme.spacing(3)};
      font-weight: 400;
    `,
    cellValueMobile: css`
      padding-top: ${theme.spacing(2)};
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
    `,
    loader: css`
      margin-bottom: ${theme.spacing(6)};
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
    getCellWrapper: ({ containsLink }: { containsLink: boolean }) => css`
      overflow: hidden;
      text-overflow: ellipsis;
      padding: ${containsLink ? 0 : theme.spacing(4)};

      > a {
        display: block;
        padding: ${theme.spacing(4)};
      }

      :first-of-type > a {
        padding-left: 0;
      }

      :last-of-type > a {
        padding-right: 0;
      }
    `,
    cellInner: css`
      text-overflow: ellipsis;
    `,
  };
};
