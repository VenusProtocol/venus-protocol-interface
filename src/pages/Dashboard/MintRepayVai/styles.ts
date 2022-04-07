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
      padding: ${theme.spacing(3)};
    `,
    header: css`
      margin-bottom: ${theme.spacing(4)};
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
    headerColumn: css`
      flex: 1;
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
    tabContentContainer: css`
      flex: 1;
      display: flex;
      flex-direction: column;
    `,
    ctaContainer: css`
      flex: 1;
    `,
    textField: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    getRow: ({ isLast }: { isLast: boolean }) => css`
      margin-bottom: ${theme.spacing(isLast ? 3 : 2)};
    `,
  };
};
