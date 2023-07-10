import * as React from 'react';
import { SVGProps } from 'react';

const SvgFourDots = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="6" cy="6.17331" r="3" fill="currentColor" />
    <circle cx="18" cy="18.1733" r="3" fill="currentColor" />
    <circle cx="18" cy="6.17331" r="3" fill="currentColor" />
    <circle cx="6" cy="18.1733" r="3" fill="currentColor" />
  </svg>
);

export default SvgFourDots;
