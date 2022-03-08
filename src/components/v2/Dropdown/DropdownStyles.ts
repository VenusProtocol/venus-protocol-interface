import { useTheme } from '@mui/material';

const MENU_ITEM_HEIGHT = 32;
export const SELECTED_MENU_ITEM_CLASSNAME = 'selected';
export const useDropdownStyles = ({ isOpened }: { isOpened: boolean }) => {
  const theme = useTheme();
  return {
    select: {
      transition: 'box-shadow .3s',
      boxShadow: isOpened ? `0px 0px 0px 2px ${theme.palette.v2.background.secondary}` : 'none',
    },
    menuPaper: {
      marginTop: 4,
      borderRadius: 0,
      backgroundColor: theme.palette.v2.background.primary,
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
        backgroundColor: theme.palette.v2.background.secondary,
      },
      [`&.${SELECTED_MENU_ITEM_CLASSNAME}`]: {
        backgroundColor: theme.palette.v2.background.secondary,
        '&:hover': {
          backgroundColor: theme.palette.v2.background.secondary,
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
