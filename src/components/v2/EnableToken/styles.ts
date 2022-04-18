import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();
  return {
    container: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      hr {
        width: 100%;
        border: 1px solid ${theme.palette.secondary.light};
        margin-bottom: ${theme.spacing(8)};
      }
    `,
    mainLogo: css`
      height: ${theme.spacing(10)};
      width: ${theme.spacing(10)};
      margin-bottom: ${theme.spacing(5)};
    `,
    mainText: css`
      text-align: center;
      margin-bottom: ${theme.spacing(10)};
    `,
    button: css`
      margin-top: ${theme.spacing(9)};
    `,
    labeledInlineContent: css`
      margin-bottom: ${theme.spacing(3)};
    `,
  };
};

export default styles;
