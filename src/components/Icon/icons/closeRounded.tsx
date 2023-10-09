import * as React from 'react';
import { SVGProps } from 'react';

const SvgCloseRounded = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 14.408L14.3999 0.0799671L15.9999 1.67197L1.59999 16L0 14.408Z"
      fill="currentColor"
    />
    <path d="M1.6001 0L16 14.328L14.4 15.92L0.00010797 1.592L1.6001 0Z" fill="currentColor" />
  </svg>
);

export default SvgCloseRounded;
