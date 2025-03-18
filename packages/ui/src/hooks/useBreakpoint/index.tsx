import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';

type Breakpoint = keyof typeof theme.screens;

export const useBreakpointDown = (breakpoint: Breakpoint) =>
  useMediaQuery({
    query: `(max-width: ${theme.screens[breakpoint]})`,
  });

export const useBreakpointUp = (breakpoint: Breakpoint) =>
  useMediaQuery({
    query: `(min-width: ${theme.screens[breakpoint]})`,
  });
