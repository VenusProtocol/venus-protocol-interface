import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();
  const accessoryColor = theme.palette.text.secondary;

  return {
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
  };
};
