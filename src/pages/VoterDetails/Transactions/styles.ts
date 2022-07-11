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
      display: block;

      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    cards: css`
      display: none;

      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
    cardContentGrid: css`
      padding-top: ${theme.spacing(4)};
      padding-bottom: ${theme.spacing(4)};

      .table__table-cards__card-content {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        row-gap: ${theme.spacing(5)};
      }

      ${theme.breakpoints.down('sm')} {
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
      align-items: center;
    `,
    anchorButton: css`
      ${theme.breakpoints.down('sm')} {
        margin: ${theme.spacing(4)} 0 0 0;
        background-color: transparent;
      }
    `,
    icon: css`
      border-radius: 50%;
      width: ${theme.shape.iconSize.medium}px;
      height: ${theme.shape.iconSize.medium}px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: ${theme.spacing(2.5)};

      svg {
        color: ${theme.palette.text.primary};
        width: ${theme.spacing(2)};
        height: ${theme.spacing(2)};
      }
    `,
    for: css`
      background-color: ${theme.palette.interactive.success};
    `,
    abstain: css`
      background-color: ${theme.palette.text.secondary};
    `,
    against: css`
      background-color: ${theme.palette.interactive.error};
    `,
    spinner: css`
      ${theme.breakpoints.down('xl')} {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
  };
};
