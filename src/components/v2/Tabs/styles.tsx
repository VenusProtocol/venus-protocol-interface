import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();

  return {
    getContainer: ({ fullWidth }: { fullWidth: boolean }) => css`
      display: flex;

      ${fullWidth &&
      css`
        width: 100%;
      `}
    `,
    getButton: ({
      active,
      last,
      fullWidth,
    }: {
      active: boolean;
      last: boolean;
      fullWidth: boolean;
    }) => css`
      ${!last &&
      css`
        margin-right: ${theme.spacing(1)};
      `};

      ${!active &&
      css`
        background-color: transparent;
        border-color: transparent;

        :not(:hover, :active) {
          color: ${theme.palette.text.secondary};
        }
      `};

      ${fullWidth &&
      css`
        flex: 1;
      `}
    `,
  };
};

export default styles;
