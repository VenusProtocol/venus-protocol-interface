import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    table: css`
      display: initial;

      ${theme.breakpoints.down('lg')} {
        display: none;
      }
    `,
    cards: css`
      display: none;
      ${theme.breakpoints.down('lg')} {
        display: initial;
      }
    `,
    cardContentGrid: css`
      ${theme.breakpoints.down('lg')} {
        background-color: initial;
      }
      .table__table-cards__card-content {
        ${theme.breakpoints.down('lg')} {
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
          grid-template-rows: 1fr;
        }
        ${theme.breakpoints.down('md')} {
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          row-gap: ${theme.spacing(5)};
        }
      }
    `,
    txnHash: css`
      width: 100%;
    `,
    txnHashText: css`
      align-items: center;
      color: ${theme.palette.button.main};

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
      ${theme.breakpoints.down('lg')} {
        display: flex;
      }
    `,
    icon: css`
      margin-top: -2px;
      margin-right: ${theme.spacing(2)};
      width: ${theme.shape.iconSize.large}px;
      height: ${theme.shape.iconSize.large}px;
    `,
  };
};
