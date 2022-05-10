import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();
  const accessoryColor = theme.palette.text.secondary;

  return {
    supplyChartColor: theme.palette.interactive.success,
    borrowChartColor: theme.palette.interactive.error,
    gridLineColor: theme.palette.secondary.light,
    accessoryColor,
    cursor: { strokeDasharray: `${SPACING} ${SPACING}`, stroke: accessoryColor },
    areaChartMargin: {
      right: SPACING * 2.5,
      left: -SPACING * 4,
    },
    areaActiveDot: { r: SPACING * 2, strokeWidth: SPACING },
    areaStrokeWidth: theme.spacing(0.5),
    axis: theme.typography.tiny,
    tickMargin: SPACING * 2,
    container: css`
      width: 100%;
      height: ${theme.spacing(62)};
    `,
    tooltipContainer: css`
      border-radius: ${theme.shape.borderRadius.small}px;
      background-color: ${theme.palette.background.default};
      padding: ${theme.spacing(3)};
    `,
    tooltipItem: css`
      display: flex;
      align-items: center;
      margin-right: auto;

      &:not(:last-of-type) {
        margin-bottom: ${theme.spacing(2)};
      }
    `,
    tooltipItemLabel: css`
      color: ${theme.palette.text.secondary};
      margin-right: ${theme.spacing(2)};
    `,
    tooltipItemValue: css`
      color: ${theme.palette.text.primary};
    `,
  };
};
