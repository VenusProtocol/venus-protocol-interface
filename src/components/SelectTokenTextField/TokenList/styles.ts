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
    header: css`
      padding: ${theme.spacing(3, 3, 0)};
      margin-bottom: ${theme.spacing(5)};
    `,
    searchField: css`
      margin-bottom: ${theme.spacing(4)};

      > div {
        background-color: ${theme.palette.secondary.main};
      }
    `,
    commonTokenList: css`
      display: flex;
      overflow-y: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;

      ::-webkit-scrollbar {
        display: none;
      }
    `,
    commonTokenButton: css`
      :not(:last-of-type) {
        margin-right: ${theme.spacing(2)};
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
