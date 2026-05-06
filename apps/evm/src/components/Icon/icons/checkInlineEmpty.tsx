import type { SVGProps } from 'react';

const SvgCheckInlineEmpty = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="1" y="1" width="16" height="16" rx="8" stroke="currentColor" stroke-width="2" />
  </svg>
);

export default SvgCheckInlineEmpty;
