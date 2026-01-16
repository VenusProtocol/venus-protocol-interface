import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      padding-bottom: ${theme.spacing(8)};

      /* add custom styles for specific markdown elements if needed */
      p {
        color: ${theme.palette.text.primary};
      }

      ul {
        list-style: initial;
      }
    `,
    content: css`
      max-width: ${theme.spacing(200)};
      width: 100%;
    `,
    markdown: css`
      margin-top: ${theme.spacing(2)};
      font-family: ${theme.typography.fontFamily};
    `,
    section: css`
      margin-top: ${theme.spacing(6)};
    `,
    votingOptionList: css`
      margin-top: ${theme.spacing(2)};
      margin-bottom: 0;
      padding-left: ${theme.spacing(6)};
    `,
  };
};
