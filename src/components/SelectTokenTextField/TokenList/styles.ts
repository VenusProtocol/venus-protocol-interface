import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

const ITEM_HEIGHT_RATIO = 10;

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      position: absolute;
      z-index: 2;
      left: 0;
      right: 0;
      top: ${theme.spacing(2)};
      border-radius: ${theme.spacing(3)};
      background-color: ${theme.palette.background.default};
      box-shadow: 0 4px 15px 0 rgba(22, 23, 30, 0.8);
      overflow: hidden;
    `,
    searchField: css`
      margin: ${theme.spacing(3, 3, 2)};

      > div {
        background-color: ${theme.palette.secondary.main};
      }
    `,
    list: css`
      max-height: ${theme.spacing(ITEM_HEIGHT_RATIO * 6)};
      overflow-y: auto;
    `,
    item: css`
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: ${theme.spacing(ITEM_HEIGHT_RATIO)};
      padding: ${theme.spacing(0, 3)};

      :hover {
        background-color: ${theme.palette.secondary.light};
      }
    `,
  };
};
