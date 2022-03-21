import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = ({ expanded }: { expanded: boolean }) => {
  const theme = useTheme();
  return {
    drawer: css`
      display: block;
      .MuiPaper-root {
        border-right: none;
      }
      ${theme.breakpoints.down('md')} {
        display: none;
      }
    `,
    toolbar: css`
      display: flex;
      justify-content: center;
      padding-top: ${theme.spacing(4)};
      padding-bottom: ${theme.spacing(3)};
      min-height: 0;
      &.MuiToolbar-root {
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
      }
      ${theme.breakpoints.down('md')} {
        min-height: initial;
      }
      ${theme.breakpoints.down('sm')} {
        padding-left: initial;
        padding-right: initial;
      }
      .MuiButton-text {
        padding: 0;
        min-width: 0;
      }
    `,
    list: css`
      padding-top: ${theme.spacing(1.25)};
      .activeMenuItem {
        color: ${theme.palette.text.primary};
        svg {
          color: ${theme.palette.text.primary};
        }
      }
    `,
    listItem: css`
      transition: color 0.3s;
      color: ${theme.palette.text.secondary};
      min-width: auto;
      padding: 0;
      a {
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(0.5)};
        padding-top: ${theme.spacing(3)};
        padding-bottom: ${theme.spacing(3)};
        display: inline-flex;
      }

      .active-menu-item {
        padding-left: ${theme.spacing(1.5)};
        .left-border {
          border: 2px solid ${theme.palette.interactive.primary};
          border-radius: 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
        }
      }
    `,
    listItemIcon: css`
      min-width: ${expanded ? '40px' : 0};
      color: inherit;
      svg {
        height: 20px;
        width: 20px;
      }
    `,
    listItemText: css`
      text-transform: none;
    `,
    logo: css`
      display: ${expanded ? 'block' : 'none'};
      height: 33px;
      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    logoMobile: css`
      display: ${expanded ? 'none' : 'block'};
      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
  };
};
