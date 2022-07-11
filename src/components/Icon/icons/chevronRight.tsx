import * as React from 'react';
import { SVGProps } from 'react';

const SvgChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41Z" fill="currentColor" />
  </svg>
);

export default SvgChevronRight;
