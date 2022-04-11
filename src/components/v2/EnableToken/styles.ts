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
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    mainLogo: css`
      height: ${theme.spacing(5.75)};
      width: ${theme.spacing(5.75)};
      margin-bottom: ${theme.spacing(2.5)};
    `,
    mainText: css`
      text-align: center;
      margin-bottom: ${theme.spacing(2.5)};
    `,
    tokenInfo: css`
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: ${theme.spacing(1.5)};
      svg {
        margin-right: ${theme.spacing(1)};
      }
    `,
    tokenInfoText: css`
      display: inline-flex;
    `,
    apy: css`
      color: ${theme.palette.text.primary};
    `,
    button: css`
      margin-top: ${theme.spacing(4.5)};
    `,
  };
};

export default styles;
