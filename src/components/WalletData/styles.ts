import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      width: 100%;
    `,
    row: css`
      display: flex;
      align-items: center;
      justify-content: space-between;

      ${theme.breakpoints.down('sm')} {
        display: block;
      }

      :not(:last-of-type) {
        margin-bottom: ${theme.spacing(3)};
      }
    `,
    column: css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('sm')} {
        :first-of-type {
          margin-bottom: ${theme.spacing(1)};
        }
      }
    `,
    tooltip: css`
      align-items: center;
      display: inline-flex;
      margin-left: ${theme.spacing(2)};
    `,
    infoIcon: css`
      cursor: help;
    `,
    label: css`
      color: ${theme.palette.text.secondary};
    `,
    whiteText: css`
      color: ${theme.palette.text.primary};
    `,
    button: css`
      padding: 0;
      height: auto;

      svg {
        transition: inherit;
        color: inherit;
        margin-right: ${theme.spacing(1)};
      }
    `,
  };
};
