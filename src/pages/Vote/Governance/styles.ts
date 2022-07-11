import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      flex: 2;
      margin-right: ${theme.spacing(4)};
    `,
    loader: css`
      height: auto;
      margin-bottom: ${theme.spacing(6)};
    `,
    bottomSpace: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    marginLess: css`
      padding: 0;
      margin-right: ${theme.spacing(2.5)};
    `,
    header: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      ${theme.breakpoints.down('lg')} {
        margin-top: ${theme.spacing(10)};
      }
    `,
    createProposal: css`
      display: flex;
      flex-direction: row;
      align-items: flex-end;
    `,
    infoIconWrapper: css`
      display: flex;
      align-self: center;
    `,
    infoIcon: css`
      cursor: help;
    `,
    pagination: css`
      justify-content: flex-start;
    `,
  };
};
