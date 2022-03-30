import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    drawer: css`
      display: block;
      width: ${theme.shape.drawerWidthDesktop};
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
      padding-top: ${theme.spacing(5)};
      padding-bottom: ${theme.spacing(6)};
      ${theme.breakpoints.up('sm')} {
        padding-left: ${theme.spacing(4)};
        padding-right: ${theme.spacing(4)};
      }
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
      a {
        padding: ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(4)};
        display: inline-flex;
        justify-content: start;
        ${theme.breakpoints.down('lg')} {
          padding: ${theme.spacing(2)};
          justify-content: center;
        }
        width: 100%;
      }
      ${theme.breakpoints.down('lg')} {
        :hover {
          border-radius: ${theme.shape.borderRadius.medium}px;
          margin-left: ${theme.spacing(1.5)};
          margin-right: ${theme.spacing(1.5)};
        }
      }

      .active-menu-item {
        padding-left: ${theme.spacing(4)};
        background-color: ${theme.palette.secondary.light};
        ${theme.breakpoints.down('lg')} {
          padding-left: ${theme.spacing(2)};
          border-radius: ${theme.shape.borderRadius.large}px;
          margin-left: ${theme.spacing(1.5)};
          margin-right: ${theme.spacing(1.5)};
        }
        :hover {
          margin-left: 0;
          margin-right: 0;
        }
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
      min-width: 32px;
      ${theme.breakpoints.down('lg')} {
        min-width: 0;
        justify-content: center;
      }
      color: inherit;
      svg {
        height: 20px;
        width: 20px;
      }
    `,
    listItemText: css`
      text-transform: none;
      display: block;
      ${theme.breakpoints.down('lg')} {
        display: none;
      }
      ${theme.breakpoints.down('sm')} {
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
        justify-content: space-between;
        padding-left: ${theme.spacing(3)};
        padding-right: ${theme.spacing(3)};
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
      height: 24px;
      width: 24px;
    `,
    mobileLabel: css`
      flex-direction: row;
      justify-content: center;
      display: inline-flex;
      align-items: center;
      svg {
        margin-right: ${theme.spacing(2)};
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
    actionButton: css`
      cursor: pointer;
      box-shadow: none;
      background-color: transparent;
      border: none;
      display: flex;
      justify-content: center;
    `,
  };
};
