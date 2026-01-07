import type { SVGProps } from 'react';

const SvgChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M2.175 3L6 6.7085L9.825 3L11 4.1417L6 9L1 4.1417L2.175 3Z" fill="currentColor" />
  </svg>
);

export default SvgChevronDown;
