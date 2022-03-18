import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      height: 56px;
      padding: 0 ${theme.spacing(2)};
      background-color: var(--color-bg-main);
      display: flex;
      justify-content: flex-end;
      align-items: center;

      ${theme.breakpoints.down('md')} {
        height: auto;
        padding: ${theme.spacing(3)} ${theme.spacing(2)};
        flex-direction: column;
      }
    `,
    status: css`
      display: flex;
      align-items: center;

      ${theme.breakpoints.down('md')} {
        margin-bottom: ${theme.spacing(2)};
      }
    `,
    statusBlockNumber: css`
      color: ${theme.palette.text.primary};
    `,
    links: css`
      color: ${theme.palette.text.primary};
    `,
    link: css`
      background-color: ${theme.palette.secondary.light};
      transition: background-color 0.3s;
      margin-left: ${theme.spacing(2)};
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      border-radius: 4px;

      :hover {
        background-color: ${theme.palette.button.main};
      }

      :active {
        background-color: ${theme.palette.button.dark};
      }
    `,
    theme,
  };
};
