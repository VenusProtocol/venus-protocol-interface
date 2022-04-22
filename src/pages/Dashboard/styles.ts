import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  const gap = theme.spacing(8);

  return {
    container: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: ${gap};

      ${theme.breakpoints.down('xl')} {
        flex-direction: column;
        margin-bottom: 0;
      }
    `,
    item: css`
      width: calc(50% - ${gap} / 2);

      ${theme.breakpoints.down('xl')} {
        width: 100%;
        margin-bottom: ${gap};
      }
    `,
    tabsWrapper: css`
      background-color: ${theme.palette.background.paper};
      border-radius: ${theme.shape.borderRadius.large}px;
    `,
    tabsHeader: css`
      padding-left: ${theme.spacing(6)};
      padding-right: ${theme.spacing(6)};
      padding-top: ${theme.spacing(6)};
    `,
    tabsTitle: css`
      text-align: center;
    `,
  };
};
