import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    inputLabels: css`
      display: inline-flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: ${theme.spacing(8)};
    `,
    inline: css`
      padding-top: 0;
      padding-bottom: ${theme.spacing(1)};
    `,
    submitButton: css`
      margin-top: ${theme.spacing(10)};
      margin-bottom: ${theme.spacing(5)};
    `,
    link: css`
      text-align: center;
      margin: auto;
      display: block;
      color: ${theme.palette.interactive.primary};
      :hover {
        color: ${theme.palette.text.primary};
        cursor: pointer;
      }
    `,
  };
};
