import type { SVGProps } from 'react';

const SvgPending = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="currentColor" />
    <circle cx="10" cy="10" r="1" fill="white" />
    <ellipse cx="14" cy="10" rx="1" ry="1" fill="white" />
    <ellipse cx="6" cy="10" rx="1" ry="1" fill="white" />
  </svg>
);

export default SvgPending;
