import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: ${theme.spacing(-2)};

      ${theme.breakpoints.down('md')} {
        flex-wrap: nowrap;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;

        ::-webkit-scrollbar {
          display: none;
        }
      }
    `,
    tag: css`
      padding: ${theme.spacing(2, 5)};
      white-space: nowrap;
      margin-top: ${theme.spacing(2)};

      :not(:last-of-type) {
        margin-right: ${theme.spacing(2)};
      }
    `,
  };
};
