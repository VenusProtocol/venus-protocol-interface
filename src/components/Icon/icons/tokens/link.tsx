import * as React from 'react';
import { SVGProps } from 'react';

const SvgLink = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#2A5ADA" />
    <path
      d="m12.069 5-1.285.739-3.5 2.022L6 8.5v7l1.284.738 3.532 2.024 1.285.738 1.284-.738 3.468-2.024 1.285-.738v-7l-1.285-.739-3.5-2.022L12.07 5Zm-3.5 9.023V9.977l3.5-2.023 3.5 2.023v4.046l-3.5 2.023-3.5-2.023Z"
      fill="#fff"
    />
  </svg>
);

export default SvgLink;
