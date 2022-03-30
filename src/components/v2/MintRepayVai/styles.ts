import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      width: 100%;
      background-color: ${theme.palette.background.paper};
      border-radius: 24px;
      padding: ${theme.spacing(3)};
    `,
    row: css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
    column: css`
      flex: 1;
    `,
    header: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    headerTitle: css`
      flex: 0 1 auto;
      padding-right: ${theme.spacing(2)};

      ${theme.breakpoints.down('sm')} {
        margin-bottom: ${theme.spacing(3)};
      }
    `,
    headerTabsContainer: css`
      display: flex;
      justify-content: flex-end;
      flex: 1;
    `,
  };
};
