import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    headerRoot: css`
      padding: ${theme.spacing(4)} 0 ${theme.spacing(4)} ${theme.spacing(6)};
      ${theme.breakpoints.down('xl')} {
        padding: ${theme.spacing(4)} 0 ${theme.spacing(4)} ${theme.spacing(4)};
        background-color: transparent;
      }
    `,
    row: css`
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    `,
    box: css`
      flex: 1;
      flex-direction: column;
      flex-basis: 25%;
      border-right: ${theme.spacing(0.25)} solid ${theme.palette.interactive.delimiter};
      padding-right: 0;
      padding-left: ${theme.spacing(10)};
      padding-top: ${theme.spacing(6)};
      padding-bottom: ${theme.spacing(6)};
      border-radius: 0;
      :first-of-type {
        padding-left: 0;
      }
      :last-of-type {
        border-right: none;
      }
      ${theme.breakpoints.down('xl')} {
        flex-basis: calc(50% - ${theme.spacing(2)});
        border-right: none;
        background-color: ${theme.palette.background.paper};
        border-radius: ${theme.shape.borderRadius.large}px;
        padding: ${theme.spacing(4)};
        :first-of-type {
          padding-left: ${theme.spacing(4)};
          margin-right: ${theme.spacing(1)};
          margin-bottom: ${theme.spacing(1)};
        }
        :nth-of-type(2) {
          margin-left: ${theme.spacing(1)};
          margin-bottom: ${theme.spacing(1)};
        }
        :nth-of-type(3) {
          margin-right: ${theme.spacing(1)};
          margin-top: ${theme.spacing(1)};
        }
        :last-of-type {
          margin-left: ${theme.spacing(1)};
          margin-top: ${theme.spacing(1)};
        }
      }
    `,
    title: css`
      margin-bottom: ${theme.spacing(1)};
      ${theme.breakpoints.down('xl')} {
        font-size: 0.75rem;
      }
    `,
    value: css`
      ${theme.breakpoints.down('xl')} {
        font-size: ${theme.typography.body2.fontSize};
        font-weight: ${theme.typography.body2.fontWeight};
        letter-spacing: ${theme.typography.body2.letterSpacing};
        color: ${theme.palette.text.primary};
      }
    `,
  };
};
