import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

const viewWidthWithScrollbar = '100vw';

export const useStyles = () => {
  const theme = useTheme();
  return {
    layout: css`
      display: flex;
      flex: 1;
      flex-direction: row;
      ${theme.breakpoints.down('md')} {
        flex-direction: column;
      }
    `,
    main: css`
      max-width: calc(${viewWidthWithScrollbar} - ${theme.shape.drawerWidthDesktop});
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;

      ${theme.breakpoints.down('lg')} {
        max-width: calc(${viewWidthWithScrollbar} - ${theme.shape.drawerWidthTablet});
      }
    `,
    ustWarning: css`
      background-color: ${theme.palette.interactive.tan};
      width: 100%;
      padding: ${theme.spacing(1)} ${theme.spacing(4)};
      justify-content: center;
      align-items: center;
      display: inline-flex;
      min-height: 56px;

      p {
        color: rgba(0, 0, 0, 1);
        display: flex;
        text-align: center;
      }

      svg {
        display: flex;
        margin-right: ${theme.spacing(2)};
        align-self: center;
        ${theme.breakpoints.down('md')} {
          height: ${theme.spacing(6)};
          width: ${theme.spacing(6)};
          margin-right: 0;
        }
      }
    `,
  };
};
