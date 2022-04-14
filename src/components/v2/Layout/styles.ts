import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    layout: css`
      display: flex;
      flex: 1;
      flex-direction: row;
      ${theme.breakpoints.down('md')} {
        flex-direction: column;
      }
    `,
    ustWarning: css`
      background-color: ${theme.palette.interactive.tan};
      width: 100%;
      padding: ${theme.spacing(1)} ${theme.spacing(4)};
      justify-content: center;
      align-items: center;
      display: inline-flex;
      min-height: 56px;

      p {
        color: rgba(0, 0, 0, 1);
        display: flex;
        text-align: center;
      }

      svg {
        display: flex;
        margin-right: ${theme.spacing(2)};
        align-self: center;
        ${theme.breakpoints.down('md')} {
          height: ${theme.spacing(6)};
          width: ${theme.spacing(6)};
          margin-right: 0;
        }
      }
    `,
  };
};
