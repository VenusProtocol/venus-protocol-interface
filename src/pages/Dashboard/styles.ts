import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    header: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: ${theme.spacing(6)};
    `,
    rightColumn: css`
      display: flex;
      align-items: center;
    `,
    toggleContainer: css`
      display: flex;
      align-items: center;
      margin-right: ${theme.spacing(8)};
    `,
    toggleLabel: css`
      margin-left: ${theme.spacing(2)};
    `,
    tooltip: css`
      display: flex;
    `,
    infoIcon: css`
      cursor: help;
    `,
    toggle: css`
      margin-left: ${theme.spacing(2)};
    `,
    searchTextField: css`
      min-width: ${theme.spacing(75)};
    `,
  };
};
