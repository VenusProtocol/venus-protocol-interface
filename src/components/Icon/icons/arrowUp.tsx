import * as React from 'react';
import { SVGProps } from 'react';

const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10.59 8L6 3.42L1.41 8L1.84899e-07 6.59L6 0.590001L12 6.59L10.59 8Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgArrowUp;
