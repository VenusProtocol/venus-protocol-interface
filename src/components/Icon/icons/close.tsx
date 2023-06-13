import * as React from 'react';
import { SVGProps } from 'react';

const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 17.799L17.7279 5.07103L19.1421 6.48524L6.41421 19.2132L5 17.799Z"
      fill="currentColor"
    />
    <path
      d="M6.41431 5L19.1422 17.7279L17.728 19.1421L5.00009 6.41421L6.41431 5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgClose;
