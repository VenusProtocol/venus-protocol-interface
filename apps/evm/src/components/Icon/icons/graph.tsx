import type { SVGProps } from 'react';

const SvgGraph = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="1" y="9.4" width="4" height="5.6" rx="1" fill="currentColor" />
    <rect x="6" y="4.73333" width="4" height="10.2667" rx="1" fill="currentColor" />
    <rect x="11" y="1" width="4" height="14" rx="1" fill="currentColor" />
  </svg>
);

export default SvgGraph;
