import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    drawer: css`
      display: block;
      width: ${theme.shape.drawerWidthDesktop};

      > .MuiDrawer-paper {
        border-right: none;
      }

      ${theme.breakpoints.down('lg')} {
        width: ${theme.shape.drawerWidthTablet};
      }
      ${theme.breakpoints.down('md')} {
        display: none;
      }
    `,
    drawerContent: css`
      width: ${theme.shape.drawerWidthDesktop};
      ${theme.breakpoints.down('lg')} {
        width: ${theme.shape.drawerWidthTablet};
      }
      display: block;
      z-index: 1000;
      position: sticky;
      top: 0;
      left: 0;
    `,
    toolbar: css`
      display: flex;
      justify-content: center;
      padding: ${theme.spacing(10, 8, 12)};
      min-height: 0;
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
      ${theme.breakpoints.down('lg')} {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    `,
    list: css`
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
      padding: 0;

      ${theme.breakpoints.down('lg')} {
        :hover {
          background-color: transparent;
        }

        :hover > a {
          background-color: ${theme.palette.secondary.light};
        }
      }

      a {
        padding: ${theme.spacing(4)} ${theme.spacing(4)} ${theme.spacing(4)} ${theme.spacing(8)};
        display: inline-flex;
        justify-content: start;
        width: 100%;

        ${theme.breakpoints.down('lg')} {
          width: auto;
          margin: auto;
          border-radius: ${theme.shape.borderRadius.medium}px;
          padding: ${theme.spacing(4)};
          justify-content: center;
        }

        ${theme.breakpoints.down('md')} {
          border-radius: 0;
        }
      }

      .active-menu-item {
        background-color: ${theme.palette.secondary.light};

        .left-border {
          border: 2px solid ${theme.palette.interactive.primary};
          border-radius: 0 ${theme.shape.borderRadius.small}px ${theme.shape.borderRadius.small}px 0;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          ${theme.breakpoints.down('lg')} {
            display: none;
          }
        }
        svg,
        p {
          color: ${theme.palette.text.primary};
        }
      }
    `,
    listItemIcon: css`
      min-width: ${theme.spacing(8)};
      ${theme.breakpoints.down('lg')} {
        min-width: 0;
        justify-content: center;
      }
      color: inherit;
      svg {
        height: ${theme.spacing(5)};
        width: ${theme.spacing(5)};
      }
    `,
    listItemText: css`
      text-transform: none;
      display: block;
      ${theme.breakpoints.down('lg')} {
        display: none;
      }
      ${theme.breakpoints.down('md')} {
        display: block;
      }
    `,
    logo: css`
      display: block;
      ${theme.breakpoints.down('lg')} {
        display: none;
      }
      height: 33px;
      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    logoClosed: css`
      display: none;
      ${theme.breakpoints.down('lg')} {
        display: block;
      }
    `,
    mobileMenuBox: css`
      display: none;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: ${theme.spacing(4)};
      ${theme.breakpoints.down('md')} {
        display: flex;
      }
    `,
    mobileLogo: css`
      flex-shrink: 0;
      height: ${theme.spacing(10)};
      width: ${theme.spacing(10)};
    `,
    burger: css`
      height: ${theme.spacing(6)};
      width: ${theme.spacing(6)};
    `,
    mobileMenu: css`
      .MuiMenu-list {
        display: flex;
        flex-direction: column;
      }

      > .MuiPaper-root {
        background-color: ${theme.palette.background.default};
        height: 100vh;
        max-height: 100vh;
        width: 100vw;
        max-width: 100vw;
        border-radius: 0;
        border: 0;
        box-shadow: none;
        padding: 0;
      }
    `,
    mobileListItem: css`
      a {
        color: ${theme.palette.text.primary};
        display: flex;
        flex-direction: row;
        flex: 1;
        padding-top: ${theme.spacing(4)};
        padding-bottom: ${theme.spacing(4)};
        justify-content: space-between;
        padding-left: ${theme.spacing(6)};
        padding-right: ${theme.spacing(6)};
      }
      :hover {
        margin-left: 0;
        margin-right: 0;
        border-radius: 0;
      }
      .active-mobile-menu-item {
        background-color: ${theme.palette.secondary.light};
        svg {
          color: ${theme.palette.interactive.primary};
        }
      }
    `,
    mobileListItemText: css`
      color: ${theme.palette.text.primary};
    `,
    mobileArrow: css`
      height: ${theme.spacing(6)};
      width: ${theme.spacing(6)};
    `,
    mobileLabel: css`
      flex-direction: row;
      justify-content: center;
      display: inline-flex;
      align-items: center;
      svg {
        margin-right: ${theme.spacing(4)};
      }
    `,
    flexRow: css`
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    `,
    doublePadding: css`
      padding: ${theme.spacing(2)} ${theme.spacing(4)}; ;
    `,
    actionButton: css`
      flex-shrink: 0;
      width: ${theme.spacing(10)};
      cursor: pointer;
      box-shadow: none;
      background-color: transparent;
      border: none;
      display: flex;
      justify-content: center;
    `,
    mobileConnectButton: css`
      margin-left: ${theme.spacing(8)};
      margin-right: ${theme.spacing(8)};
    `,
    claimXvsRewardButton: css`
      margin: ${theme.spacing(4, 4, 0, 4)};
    `,
  };
};
