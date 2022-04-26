import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    theme,
    container: css`
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: ${theme.palette.background.paper};
      border-radius: ${theme.shape.borderRadius.large}px;
      padding: ${theme.spacing(6)};
    `,
    tabContentContainer: css`
      flex: 1;
      display: flex;
      flex-direction: column;
    `,
    ctaContainer: css`
      flex: 1;
    `,
    textField: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 6 : 4)};
    `,
  };
};
