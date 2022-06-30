import * as React from 'react';
import { SVGProps } from 'react';

const SvgChevronLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M16 7.41L11.42 12L16 16.59L14.59 18L8.59 12L14.59 6L16 7.41Z" fill="currentColor" />
  </svg>
);

export default SvgChevronLeft;
