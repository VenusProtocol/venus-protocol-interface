import { Breakpoint, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useBreakpointDown = (breakpoint: Breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};

export const useIsXsDown = () => useBreakpointDown('xs');
export const useIsSmDown = () => useBreakpointDown('sm');
export const useIsMdDown = () => useBreakpointDown('md');
export const useIsLgDown = () => useBreakpointDown('lg');
export const useIsXlDown = () => useBreakpointDown('xl');
