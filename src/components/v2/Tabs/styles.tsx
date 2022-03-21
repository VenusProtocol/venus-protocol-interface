import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: flex;
    `,
    button: css`
      margin-right: ${theme.spacing(3)};
    `,
  };
};

export default styles;
