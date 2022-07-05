import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      display: inline-block;
      color: ${theme.palette.button.main};

      :hover > a,
      :hover > svg {
        color: ${theme.palette.button.medium};
      }

      :active > a,
      :active > svg {
        color: ${theme.palette.button.dark};
      }
    `,
    text: css`
      display: flex;
      align-items: center;
      color: inherit;
    `,
    icon: css`
      color: inherit;
      margin-left: ${theme.spacing(2)};
    `,
  };
};
