import * as React from 'react';
import { SVGProps } from 'react';

const SvgBusd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#F0B90B" />
    <path
      d="m11.976 4 1.976 2.024L8.976 11 7 9.024 11.976 4ZM14.976 7l1.976 2.024L8.976 17 7 15.024 14.976 7ZM5.976 10l1.976 2.024L5.976 14 4 12.024 5.976 10ZM17.976 10l1.976 2.024L11.976 20 10 18.024 17.976 10Z"
      fill="#fff"
    />
  </svg>
);

export default SvgBusd;
