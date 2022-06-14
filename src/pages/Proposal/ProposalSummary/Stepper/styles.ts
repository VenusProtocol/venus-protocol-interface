import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      ${theme.breakpoints.down('lg')} {
        flex-direction: row;
      }
    `,
    step: css`
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: space-between;
    `,
    labelAndIcon: css`
      display: flex;
      flex-direction: row;
      align-items: center;
    `,
    labelText: ({ completed }: { completed: boolean }) => css`
      color: ${completed ? theme.palette.text.primary : theme.palette.text.secondary};
      font-weight: 600;
      padding-left: ${theme.spacing(3)};
    `,
    date: css`
      align-self: flex-end;
    `,
    closeIcon: css`
      height: ${theme.spacing(1.5)};
      width: ${theme.spacing(1.5)};
    `,
    markIcon: css`
      height: ${theme.spacing(1.5)};
      width: ${theme.spacing(2)};
    `,
    iconContainer: css`
      height: ${theme.spacing(6)};
      width: ${theme.spacing(6)};
      flex-shrink: 0;
      justify-content: center;
      display: flex;
      align-items: center;
      border-radius: ${theme.spacing(4)};
    `,
    errorIconContainer: css`
      background-color: ${theme.palette.interactive.error};
      border: 1px solid ${theme.palette.interactive.error};
    `,
    markIconContainer: css`
      background-color: ${theme.palette.interactive.success};
      border: 1px solid ${theme.palette.interactive.success};
    `,
    numberIconContainer: css`
      background-color: transparent;
      border: 1px solid ${theme.palette.text.secondary};
    `,
    connector: css`
      border-left: 1px solid ${theme.palette.text.secondary};
      height: ${theme.spacing(4)};
      width: 0;
      margin-left: calc(${theme.spacing(3)} - 0.5px);
    `,
  };
};
