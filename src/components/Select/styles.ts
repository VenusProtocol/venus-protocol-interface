import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import imgMark from 'assets/img/mark.svg';

export const SELECTED_MENU_ITEM_CLASSNAME = 'SELECTED_MENU_ITEM_CLASSNAME';
export const useStyles = () => {
  const theme = useTheme();

  return {
    root: ({ isOpen }: { isOpen: boolean }) => css`
      background-color: ${theme.palette.secondary.light};
      border-radius: ${theme.shape.borderRadius.small}px;
      border: 1px solid ${isOpen ? theme.palette.interactive.primary : 'transparent'};
      width: 100%;
      > div {
        padding: ${theme.spacing(3, 4)};
      }
    `,
    getArrowIcon: ({ isMenuOpened }: { isMenuOpened: boolean }) => css`
      position: absolute;
      right: ${theme.spacing(4)};
      width: ${theme.spacing(3)};
      transition: transform 0.3s;
      transform: rotate(${isMenuOpened ? '180deg' : '0'});
    `,
    menuItem: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${theme.palette.text.primary};

      &:active,
      &:hover,
      &:focus {
        background-color: ${theme.palette.background.default};

        ${theme.breakpoints.down('sm')} {
          background-color: ${theme.palette.secondary.light};
        }
      }

      &.${SELECTED_MENU_ITEM_CLASSNAME} {
        background-color: ${theme.palette.background.default}!important;

        ${theme.breakpoints.down('sm')} {
          background-color: ${theme.palette.secondary.light}!important;
        }

        /* check mark for selected item */
        &::after {
          content: '';
          background-image: url(${imgMark});
          background-size: cover;
          width: 12px;
          height: 8px;
        }
      }
      ${theme.breakpoints.down('sm')} {
        padding-top: 0;
      }
    `,
    mobileHeader: css`
      display: none;

      ${theme.breakpoints.down('sm')} {
        padding: ${theme.spacing(6, 4)};
        display: flex;
        align-items: center;
        justify-content: center;
        position: sticky;
        top: 0;
        background-color: ${theme.palette.background.paper};
        z-index: 1;
        border-bottom: 1px solid ${theme.palette.secondary.light};
      }
    `,
    closeMenuButton: css`
      position: absolute;
      right: 0;
    `,

    /* styles passed as MenuProps are not recognized if we pass them as emotion SerializedStyles */
    menuWrapper: {
      backgroundColor: theme.palette.secondary.light,
      padding: 0,
      borderRadius: `${theme.shape.borderRadius.small}px`,
      marginTop: theme.spacing(1),

      [theme.breakpoints.down('sm')]: {
        minWidth: 'calc(100vw)',
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: `${theme.shape.borderRadius.large}px`,
      },
    },
  };
};
