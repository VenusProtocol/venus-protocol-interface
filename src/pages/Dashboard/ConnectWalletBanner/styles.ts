import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      margin-bottom: ${theme.spacing(8)};
      display: flex;
      padding: 0;
      overflow: hidden;
    `,
    content: css`
      flex: 4;
      padding: ${theme.spacing(10)};
    `,
    title: css`
      margin-bottom: ${theme.spacing(4)};
    `,
    description: css`
      margin-bottom: ${theme.spacing(8)};
    `,
    illustrationContainer: css`
      position: relative;
      flex: 5;
    `,
    illustration: css`
      position: absolute;
      height: ${theme.spacing(219)};
      top: ${theme.spacing(-45)};
      left: ${theme.spacing(-18)};
    `,
  };
};
