import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    control: css`
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
      margin-left: ${theme.spacing(2)};
    `,
    button: css`
      padding: 0;
      color: ${theme.palette.interactive.error};

      :hover:not(:disabled),
      :active:not(:disabled) {
        color: ${theme.palette.interactive.error50};
      }

      svg {
        transition: inherit;
        color: inherit;
      }
    `,
    buttonTooltip: css`
      display: inline-flex;
    `,
    buttonIcon: css`
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
    `,
  };
};
