import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

const ROW_HEIGHT_MULTIPLICATOR = 12;

export const useStyles = () => {
  const theme = useTheme();

  return {
    container: css`
      z-index: 2;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      border-radius: ${theme.spacing(3)};
      overflow: hidden;
    `,
    row: css`
      display: flex;
      height: ${theme.spacing(ROW_HEIGHT_MULTIPLICATOR)};
    `,
    cell: css`
      flex: 1;
      padding-left: ${theme.spacing(4)};
      padding-right: ${theme.spacing(4)};
      display: flex;
      align-items: center;
    `,
    headerRow: css`
      background-color: ${theme.palette.background.default};
      color: ${theme.palette.text.secondary};
    `,
    dataRowList: css`
      max-height: ${theme.spacing(ROW_HEIGHT_MULTIPLICATOR * 4)};
      overflow-y: auto;
    `,
    dataRow: css`
      background-color: ${theme.palette.secondary.light};

      span {
        color: ${theme.palette.text.primary};
      }
    `,
    footer: css`
      background-color: ${theme.palette.secondary.light};
      justify-content: center;
    `,
    hideAssetButtonContent: css`
      display: flex;
      align-items: center;
    `,
    hideAssetButtonIcon: css`
      color: inherit;
      width: ${theme.spacing(3)};
      height: ${theme.spacing(3)};
      margin-left: ${theme.spacing(2)};
    `,
  };
};
