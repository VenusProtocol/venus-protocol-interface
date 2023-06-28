import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-right: ${theme.spacing(4)};
      margin-top: ${theme.spacing(-2)};

      ${theme.breakpoints.down('xl')} {
        margin-right: 0;
      }

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
      border-radius: ${theme.spacing(6)};
      padding: ${theme.spacing(2, 5)};
      white-space: nowrap;
      margin-top: ${theme.spacing(2)};

      :not(:last-of-type) {
        margin-right: ${theme.spacing(2)};
      }
    `,
  };
};
