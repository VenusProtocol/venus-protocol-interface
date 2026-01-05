import { css } from '@emotion/react';
import { type Breakpoint, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useBreakpointDown = (breakpoint: Breakpoint) => {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.down(breakpoint));
};

export const useBreakpointUp = (breakpoint: Breakpoint) => {
  const theme = useTheme();

  return useMediaQuery(theme.breakpoints.up(breakpoint));
};

export const useIsXsDown = () => useBreakpointDown('xs');
export const useIsSmDown = () => useBreakpointDown('sm');
export const useIsMdDown = () => useBreakpointDown('md');
export const useIsLgDown = () => useBreakpointDown('lg');
export const useIsXlDown = () => useBreakpointDown('xl');
export const useIsXxlDown = () => useBreakpointDown('2xl');

export const useBreakpointHideDown = (breakpoint: Breakpoint) => {
  const theme = useTheme();

  return css`
    ${theme.breakpoints.down(breakpoint)} {
      display: none;
    }
  `;
};

export const useHideXsDownCss = () => useBreakpointHideDown('xs');
export const useHideSmDownCss = () => useBreakpointHideDown('sm');
export const useHideMdDownCss = () => useBreakpointHideDown('md');
export const useHideLgDownCss = () => useBreakpointHideDown('lg');
export const useHideXlDownCss = () => useBreakpointHideDown('xl');
export const useHideXxlDownCss = () => useBreakpointHideDown('2xl');

export const useBreakpointShowDown = (breakpoint: Breakpoint) => {
  const theme = useTheme();

  return css`
    ${theme.breakpoints.up(breakpoint)} {
      display: none;
    }
  `;
};

export const useShowXsDownCss = () => useBreakpointShowDown('xs');
export const useShowSmDownCss = () => useBreakpointShowDown('sm');
export const useShowMdDownCss = () => useBreakpointShowDown('md');
export const useShowLgDownCss = () => useBreakpointShowDown('lg');
export const useShowXlDownCss = () => useBreakpointShowDown('xl');
export const useShowXxlDownCss = () => useBreakpointShowDown('2xl');
