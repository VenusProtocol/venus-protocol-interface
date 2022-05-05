import { css } from '@emotion/react';
import { useTheme } from '@mui/material';
import imgMark from 'components/v2/Icon/icons/mark.svg';

export const SELECTED_MENU_ITEM_CLASSNAME = 'SELECTED_MENU_ITEM_CLASSNAME';
export const useStyles = () => {
  const theme = useTheme();

  return {
    root: css`
      background-color: ${theme.palette.background.paper};
      border-radius: ${theme.shape.borderRadius.small}px;
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
        background-color: ${theme.palette.secondary.light};
      }

      &.${SELECTED_MENU_ITEM_CLASSNAME} {
        /* check mark for selected item */
        &::after {
          content: '';
          background-image: url(${imgMark});
          background-size: cover;
          width: 12px;
          height: 8px;
        }
      }
    `,
    mobileHeader: css`
      display: none;

      ${theme.breakpoints.down('sm')} {
        padding: ${theme.spacing(4)};
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
    menuList: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: 0,
      },
    },
    menuWrapper: {
      padding: 0,
      borderRadius: theme.shape.borderRadius.small,
      marginTop: theme.spacing(1),

      [theme.breakpoints.down('sm')]: {
        width: `calc(100vw - ${theme.spacing(4)})`,
      },
    },
  };
};
