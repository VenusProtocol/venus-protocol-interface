import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      width: 100%;
      background-color: ${theme.palette.background.paper};
      border-radius: ${theme.shape.borderRadius.large}px;
      padding: ${theme.spacing(3)};
    `,
    row: css`
      display: flex;
      align-items: center;
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
    `,
    headerTabsContainer: css`
      display: flex;
      justify-content: flex-end;
      flex: 1;
    `,
  };
};
