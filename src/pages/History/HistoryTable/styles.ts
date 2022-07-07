import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    table: css`
      display: block;

      ${theme.breakpoints.down('xl')} {
        display: none;
      }
    `,
    cards: css`
      display: none;
      ${theme.breakpoints.down('xl')} {
        display: block;
      }
    `,
    cardContentGrid: css`
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      ${theme.breakpoints.down('xl')} {
        background-color: initial;
      }
      .table__table-cards__card-content {
        ${theme.breakpoints.down('xl')} {
          > div > div {
            overflow: initial;
          }
          grid-template-columns:
            calc(20% - ${theme.spacing(11)}) auto auto calc(20% - ${theme.spacing(11)})
            calc(20% - ${theme.spacing(11)}) auto;
          grid-template-rows: 1fr;
          justify-content: space-between;
        }
        ${theme.breakpoints.down('md')} {
          grid-template-columns: calc(33% - ${theme.spacing(4)}) calc(33% - ${theme.spacing(4)}) auto;
          grid-template-rows: 1fr 1fr;
          row-gap: ${theme.spacing(5)};
        }
        ${theme.breakpoints.down('sm')} {
          row-gap: ${theme.spacing(4)};
        }
      }
    `,
    txnHashText: css`
      align-items: center;
      color: ${theme.palette.button.main};
      padding: 0 !important;

      :hover {
        color: ${theme.palette.button.medium};
      }

      :active {
        color: ${theme.palette.button.dark};
      }
    `,
    typeCol: css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `,
    cardTitle: css`
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      ${theme.breakpoints.down('xl')} {
        display: flex;
      }
    `,
    icon: css`
      flex-shrink: 0;
      margin-top: -2px;
      margin-right: ${theme.spacing(2)};
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
    `,
  };
};
