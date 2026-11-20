import type { SVGProps } from 'react';

const SvgSystem = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="2.75"
      y="3.75"
      width="14.5"
      height="10"
      rx="1.75"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M7 16.75h6M10 13.75v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default SvgSystem;
