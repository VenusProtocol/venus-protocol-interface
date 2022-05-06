import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import { BREAKPOINTS } from '../theme/MuiThemeProvider/muiTheme';

export const useBreakpointDown = (breakpoint: keyof typeof BREAKPOINTS.values) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};

export const useIsXsDown = () => useBreakpointDown('xs');
export const useIsSmDown = () => useBreakpointDown('sm');
export const useIsMdDown = () => useBreakpointDown('md');
export const useIsLgDown = () => useBreakpointDown('lg');
export const useIsXlDown = () => useBreakpointDown('xl');
