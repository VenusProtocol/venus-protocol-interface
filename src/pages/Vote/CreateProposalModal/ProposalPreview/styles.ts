import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      margin-bottom: ${theme.spacing(10)};
    `,
    header: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    section: css`
      margin-bottom: ${theme.spacing(6)};
    `,
    ul: css`
      padding-inline-start: ${theme.spacing(2)};
      list-style: none;
      > li {
        display: flex;
        align-items: center;
      }
      > li::before {
        content: '';
        width: ${theme.spacing(0.5)};
        height: ${theme.spacing(0.5)};
        border-radius: 50%;
        background: ${theme.palette.text.primary};
        margin-right: ${theme.spacing(2)};
      }
    `,
    signature: css`
      color: ${theme.palette.text.primary};
      overflow-wrap: break-word;
      > a {
        color: ${theme.palette.interactive.success};
        :hover {
          color: ${theme.palette.interactive.success50};
        }
      }
    `,
    markdown: css`
      margin-top: ${theme.spacing(2)};
      background-color: ${theme.palette.background.paper};
      font-family: ${theme.typography.fontFamily};
      max-width: ${theme.spacing(200)};
    `,
  };
};
