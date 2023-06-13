import { css } from '@emotion/react';
import { useTheme } from '@mui/material';
import { ReferenceLine } from 'recharts';

import { SPACING } from 'theme/MuiThemeProvider/muiTheme';

export const useStyles = () => {
  const theme = useTheme();

  return {
    lineBorrowApyColor: theme.palette.interactive.error,
    lineSupplyApyColor: theme.palette.interactive.success,
    lineActiveDot: { r: SPACING * 1.5, strokeWidth: 0 },
    container: css`
      width: 100%;
      height: ${theme.spacing(95)};
    `,
    referenceLineColor: theme.palette.interactive.primary,
    referenceLineLabel: {
      position: {
        y: -10,
        x: 48,
      },
      fill: theme.palette.text.primary,
      fontSize: theme.typography.small1.fontSize,
      fontWeight: theme.typography.small1.fontWeight,
    } as React.ComponentProps<typeof ReferenceLine>['label'],
  };
};
