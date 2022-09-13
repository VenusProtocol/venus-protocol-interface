import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    root: css`
      display: flex;
      flex: 1;
      flex-direction: column;
    `,
    breadcrumbNavigationAddress: css`
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      max-width: ${theme.spacing(50)};
    `,
    breadcrumbNavigationCopyIcon: css`
      display: inline-flex;
      cursor: pointer;
      color: ${theme.palette.interactive.primary};
      margin-left: ${theme.spacing(2)};
      height: ${theme.spacing(5.5)};
      width: auto;

      :hover {
        color: ${theme.palette.button.medium};
      }
    `,
    top: css`
      display: flex;
      flex: 1;
      flex-direction: row;
      margin-bottom: ${theme.spacing(10)};
      ${theme.breakpoints.down('xl')} {
        flex-direction: column;
      }
      ${theme.breakpoints.down('sm')} {
        margin-bottom: ${theme.spacing(4)};
      }
    `,
    topRowLeft: css`
      display: flex;
      flex: 1;
      margin-right: ${theme.spacing(4)};
      ${theme.breakpoints.down('xl')} {
        margin-right: 0;
      }
    `,
    topRowRight: css`
      display: flex;
      flex: 1;
      margin-left: ${theme.spacing(4)};
      ${theme.breakpoints.down('xl')} {
        margin-left: 0;
        margin-top: ${theme.spacing(6)};
      }
    `,
  };
};
