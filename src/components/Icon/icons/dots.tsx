import * as React from 'react';
import { SVGProps } from 'react';

const SvgDots = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="21"
    height="4"
    viewBox="0 0 21 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="10.5" cy="2" r="2" fill="currentColor" />
    <circle cx="18.5" cy="2" r="2" fill="currentColor" />
    <circle cx="2.5" cy="2" r="2" fill="currentColor" />
  </svg>
);

export default SvgDots;
