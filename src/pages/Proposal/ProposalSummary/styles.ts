import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      flex-direction: row;
    `,
    leftSection: css`
      display: flex;
      flex-direction: column;
      flex: 3;
      border-right: ${theme.spacing(0.25)} solid ${theme.palette.text.secondary};
      padding-right: ${theme.spacing(6)};
    `,
    topRow: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: ${theme.spacing(6)};
    `,
    rightSection: css`
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-left: ${theme.spacing(6)};
    `,
    chipSpace: css`
      padding-right: ${theme.spacing(2)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(2)};
    `,
    content: css`
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    `,
    rightTitle: css`
      margin-bottom: ${theme.spacing(6)};
    `,
  };
};
