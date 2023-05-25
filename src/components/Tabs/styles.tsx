import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();

  return {
    buttonsContainer: css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(8)};
      width: 100%;

      > button {
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
      }

      ${theme.breakpoints.down('sm')} {
        width: 100%;
      }
    `,
  };
};

export default styles;
