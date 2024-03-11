import type { SVGProps } from 'react';

const SvgBin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3" y="15.1733" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="15" y="3.17334" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M8 16.1733L16 8.17334" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default SvgBin;
