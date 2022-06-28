import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      flex-direction: column;
      padding: ${theme.spacing(6)} 0;
      ${theme.breakpoints.down('sm')} {
        background-color: transparent;
      }
    `,
    horizontalPadding: css`
      margin: 0 ${theme.spacing(6)};
    `,
    table: css`
      display: initial;

      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    cards: css`
      display: none;
      ${theme.breakpoints.down('sm')} {
        display: initial;
      }
    `,
    cardContentGrid: css`
      padding-top: ${theme.spacing(2.5)};
      padding-bottom: ${theme.spacing(8.5)};
      .table__table-cards__card-content {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        row-gap: 20px;
      }
      ${theme.breakpoints.down('md')} {
        background-color: transparent;
      }
    `,
    received: css`
      color: ${theme.palette.interactive.success};
      transform: rotate(270deg);
      margin-right: ${theme.spacing(2.5)};
    `,
    sent: css`
      color: ${theme.palette.interactive.error};
      transform: rotate(90deg);
      margin-right: ${theme.spacing(2.5)};
    `,
    action: css`
      display: inline-flex;
    `,
    anchorButton: css`
      ${theme.breakpoints.down('sm')} {
        margin: ${theme.spacing(4)} 0 0 0;
        background-color: transparent;
      }
    `,
  };
};
