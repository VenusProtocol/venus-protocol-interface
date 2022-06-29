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
    `,

    markdown: css`
      margin-top: ${theme.spacing(2)};
      background-color: ${theme.palette.background.paper};
      font-family: ${theme.typography.fontFamily};
      max-width: ${theme.spacing(200)};
    `,
    actionTitle: css`
      a {
        color: ${theme.palette.interactive.success};
      }

      :hover {
        color: ${theme.palette.interactive.success50};
      }
    `,
    section: css`
      margin-top: ${theme.spacing(6)};
    `,
  };
};
