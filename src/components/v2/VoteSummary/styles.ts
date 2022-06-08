import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      border-radius: ${theme.shape.borderRadius.medium}px;
    `,
    inner: css`
      border-radius: ${theme.shape.borderRadius.medium}px;
    `,
    button: css`
      width: 100%;
      margin-top: ${theme.spacing(8)};
      margin-bottom: ${theme.spacing(8)};
    `,
    voteFrom: css`
      margin-top: ${theme.spacing(2)};
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
      &:first-of-type {
        margin-top: ${theme.spacing(3)};
      }
    `,
    address: css`
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      max-width: 50%;
    `,
    blueText: css`
      color: ${theme.palette.interactive.primary};
    `,
    addressText: css`
      margin-right: ${theme.spacing(3)};
    `,
  };
};
