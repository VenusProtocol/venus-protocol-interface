import type { SVGProps } from 'react';

const SvgCheckInlineDotted = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="1" y="1" width="16" height="16" rx="8" stroke="currentColor" stroke-width="2" />
    <rect x="5" y="5" width="8" height="8" rx="4" fill="currentColor" />
  </svg>
);

export default SvgCheckInlineDotted;
