import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const styles = () => {
  const theme = useTheme();

  return {
    getContainer: ({ hasTitle }: { hasTitle: boolean }) => css`
      display: flex;
      margin-bottom: ${theme.spacing(6)};
      width: 100%;

      ${hasTitle &&
      css`
        align-items: center;

        ${theme.breakpoints.down('sm')} {
          flex-wrap: wrap;
        }
      `}
    `,
    headerTitle: css`
      flex: 0 1 auto;
      margin-right: auto;
      padding-right: ${theme.spacing(4)};

      ${theme.breakpoints.down('sm')} {
        width: 100%;
        margin-bottom: ${theme.spacing(6)};
      }
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
      :hover:not(:disabled),
      :active:not(:disabled) {
        background-color: ${theme.palette.secondary.light};
        border-color: ${theme.palette.secondary.light};
      }

      ${!last &&
      css`
        margin-right: ${theme.spacing(2)};
      `};

      ${!active &&
      css`
        background-color: transparent;
        border-color: transparent;

        :not(:hover, :active) {
          color: ${theme.palette.text.secondary};
        }

        :hover {
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
