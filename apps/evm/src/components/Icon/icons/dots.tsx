import type { SVGProps } from 'react';

const SvgDots = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <circle id="Ellipse 1095" cx="4" cy="10" r="2" fill="currentColor" />
      <circle id="Ellipse 1096" cx="10" cy="10" r="2" fill="currentColor" />
      <circle id="Ellipse 1097" cx="16" cy="10" r="2" fill="currentColor" />
    </g>
  </svg>
);

export default SvgDots;
