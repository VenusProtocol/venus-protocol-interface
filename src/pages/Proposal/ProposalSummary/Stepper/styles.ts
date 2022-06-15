import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      display: flex;
      flex-direction: column;

      ${theme.breakpoints.down('lg')} {
        flex-direction: row;
        position: relative;
      }
      ${theme.breakpoints.down('sm')} {
        flex-direction: column;
        position: initial;
      }
    `,
    step: css`
      display: flex;
      flex-direction: row;
      flex: 1;
      justify-content: space-between;

      ${theme.breakpoints.down('lg')} {
        flex-direction: column;
      }
      ${theme.breakpoints.down('sm')} {
        flex-direction: row;
      }
    `,
    labelAndIcon: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      ${theme.breakpoints.down('lg')} {
        align-items: start;
        flex-direction: column;
      }
      ${theme.breakpoints.down('sm')} {
        flex-direction: row;
        align-items: center;
      }
    `,
    labelText: ({ completed }: { completed: boolean }) => css`
      color: ${completed ? theme.palette.text.primary : theme.palette.text.secondary};
      font-weight: 600;
      padding-left: ${theme.spacing(3)};
      ${theme.breakpoints.down('lg')} {
        padding-left: 0;
        position: absolute;
        top: ${theme.spacing(8)};
      }
      ${theme.breakpoints.down('sm')} {
        position: initial;
        padding-left: ${theme.spacing(3)};
      }
    `,
    dateDefault: css`
      align-self: flex-end;
      color: ${theme.palette.text.secondary};
      ${theme.breakpoints.down('lg')} {
        display: none;
      }
      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
    dateTablet: css`
      margin-top: ${theme.spacing(1)};
      color: ${theme.palette.text.secondary};
      font-weight: 400;
      align-self: flex-end;
      display: none;
      min-width: ${theme.spacing(20)};
      ${theme.breakpoints.down('lg')} {
        display: block;
      }
      ${theme.breakpoints.down('sm')} {
        display: none;
      }
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
      ${theme.breakpoints.down('lg')} {
        margin-bottom: ${theme.spacing(3)};
      }
      ${theme.breakpoints.down('sm')} {
        margin-bottom: 0;
      }
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

      ${theme.breakpoints.down('lg')} {
        display: flex;
        margin-left: 0;
        margin-top: calc(${theme.spacing(3)} - 0.5px);
        height: 100%;
        border-bottom: 1px solid ${theme.palette.text.secondary};
        border-left: none;
        width: ${theme.spacing(25)};
      }
      ${theme.breakpoints.down('sm')} {
        border-bottom: none;
        border-left: 1px solid ${theme.palette.text.secondary};
        height: ${theme.spacing(4)};
        width: 0;
        margin-left: calc(${theme.spacing(3)} - 0.5px);
        margin-top: 0;
      }
    `,
  };
};
