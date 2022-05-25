import * as React from 'react';
import { SVGProps } from 'react';

const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.304 5.388 11.667 0H14L7.304 8 0 0h2.333l4.971 5.388Z" fill="#fff" />
  </svg>
);

export default SvgArrowDown;
