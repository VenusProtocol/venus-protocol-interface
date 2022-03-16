import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

const MENU_ITEM_HEIGHT = 32;
export const SELECTED_MENU_ITEM_CLASSNAME = 'selected';
export const useStyles = ({ isOpened }: { isOpened: boolean }) => {
  const theme = useTheme();
  return {
    select: css`
      transition: box-shadow 0.3s;
      box-shadow: ${isOpened ? `0px 0 0 2px ${theme.palette.background.paper}` : 'none'};
      line-height: 24px;
      border-radius: ${theme.shape.borderRadius}px;
      height: 32px;
      box-sizing: border-box;
      .MuiSelect-icon {
        transition: transform 0.3s;
      }
      .MuiSelect-select {
        padding-top: ${theme.spacing(0.5)};
        padding-bottom: ${theme.spacing(0.5)};
        padding-left: ${theme.spacing(1.5)};
        background-color: ${theme.palette.background.paper};
        border-radius: ${theme.shape.borderRadius}px;
      }
    `,
    menuPaper: {
      marginTop: 4,
      borderRadius: 0,
      backgroundColor: theme.palette.background.default,
      backgroundImage: 'none',
    },
    menuList: {
      padding: 0,
      maxHeight: MENU_ITEM_HEIGHT * 5,
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'space-between',
      height: MENU_ITEM_HEIGHT,
      transition: 'background-color .3s',
      '&:hover, &:focus': {
        backgroundColor: theme.palette.background.paper,
      },
      [`&.${SELECTED_MENU_ITEM_CLASSNAME}`]: {
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: theme.palette.background.paper,
        },
      },
    },
    asset: {
      width: 24,
      height: 24,
      marginRight: 12,
    },
  };
};
