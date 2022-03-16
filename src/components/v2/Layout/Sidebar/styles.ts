import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

export const useStyles = () => {
  const theme = useTheme();
  return {
    drawer: css`
      width: ${theme.shape.sidebarWidth};
      flex-shrink: 0;
      .MuiDrawer-paper {
        width: ${theme.shape.sidebarWidth};
        border-radius: 0 16px 16px 0;
        border: none;
      }
    `,
    toolbar: css`
      display: flex;
      justify-content: center;
    `,
    list: css`
      padding-top: 10px;
    `,
    listItem: css`
      transition: 'color .3s';
      color: ${theme.palette.text.secondary};
      padding-left: 3px;
      padding-right: 3px;
      & + & {
        margin-top: 2px;
      }
      &:hover {
        color: ${theme.palette.text.primary};
      }
    `,
    activeMenuItem: { color: theme.palette.text.primary },
    listItemIcon: css`
      min-width: 40px;
      color: inherit;
    `,
  };
};
