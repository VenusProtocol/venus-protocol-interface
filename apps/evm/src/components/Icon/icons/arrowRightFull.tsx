import type { SVGProps } from 'react';

const SvgArrowRightFull = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 12.3334L18.3332 12.3334"
      stroke="#AAB3CA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.3333 8.99996L18.3333 12.3138L14.3333 15.6666"
      stroke="#AAB3CA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgArrowRightFull;
