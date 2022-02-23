import { useTheme } from '@mui/material';

const MENU_ITEM_HEIGHT = 32;
export const SELECTED_MENU_ITEM_CLASSNAME = 'selected';
export const useDropdownStyles = ({ isOpened }: { isOpened: boolean }) => {
  const theme = useTheme();
  return {
    select: {
      transition: 'box-shadow .3s',
      boxShadow: isOpened ? '0px 0px 0px 2px rgba(24, 144, 255, 0.2)' : 'none',
    },
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
        backgroundColor: theme.palette.secondary.light,
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
