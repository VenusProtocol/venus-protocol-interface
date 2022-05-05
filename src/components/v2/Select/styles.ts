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
    menuWrapper: {
      padding: 0,
      borderRadius: theme.shape.borderRadius.small,
      marginTop: theme.spacing(1),
    },
  };
};
