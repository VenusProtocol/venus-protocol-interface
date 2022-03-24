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
        justify-content: space-between;
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
    logoClosed: css`
      display: ${expanded ? 'none' : 'block'};
      ${theme.breakpoints.down('sm')} {
        display: block;
      }
    `,
    mobileMenuBox: css`
      display: none;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: ${theme.spacing(2)};
      ${theme.breakpoints.down('md')} {
        display: flex;
      }
    `,
    mobileLogo: css`
      display: none;
      ${theme.breakpoints.down('sm')} {
        display: block;
      }
      height: 40px;
      width: 40px;
    `,
    burger: css`
      height: 24px;
      width: 24px;
    `,
    mobileMenu: css`
      > .MuiPaper-root {
        background-color: ${theme.palette.background.default};
        background-image: none;
        position: absolute;
        top: 0;
        left: 0;
        height: 100vh;
        max-height: 100vh;
        width: 100vw;
        max-width: 100vw;
        border-radius: 0;
        border: 0;
        box-shadow: none;
      }
    `,
    mobileListItem: css`
      a {
        color: ${theme.palette.text.primary};
        display: flex;
        flex-direction: row;
        flex: 1;
        padding-top: ${theme.spacing(2)};
        padding-bottom: ${theme.spacing(2)};
      }
      .active-mobile-menu-item {
        svg {
          color: ${theme.palette.interactive.primary};
        }
      }
    `,
    mobileListItemText: css`
      color: ${theme.palette.text.primary};
    `,
    mobileArrow: css`
      height: 24px;
      width: 24px;
      margin-right: ${theme.spacing(2.5)};
    `,
    mobileLabel: css`
      flex-direction: row;
      justify-content: center;
      display: inline-flex;
      align-items: center;
    `,
    flexRow: css`
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `,
    doublePadding: css`
      padding: ${theme.spacing(1)} ${theme.spacing(2)}; ;
    `,
    coinInfo: css`
      > div {
        display: flex;
        flex: 1;
      }
      div:first-child {
        margin-right: ${theme.spacing(1)};
      }
      div:last-child {
        margin-left: 0 ${theme.spacing(1)};
      }
    `,
  };
};
