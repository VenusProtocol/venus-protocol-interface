import { useTheme } from '@mui/material';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();
  const accessoryColor = theme.palette.text.secondary;

  return {
    defaultChartColor: theme.palette.interactive.success,
    gridLineColor: theme.palette.secondary.light,
    accessoryColor,
    cursor: { strokeDasharray: `${SPACING} ${SPACING}`, stroke: accessoryColor },
    areaActiveDot: { r: SPACING * 2, strokeWidth: SPACING },
    areaStrokeWidth: theme.spacing(0.5),
  };
};
