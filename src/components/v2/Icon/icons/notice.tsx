import * as React from 'react';
import { SVGProps } from 'react';

const SvgNotice = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 8c0-3.864 3.136-7 7-7s7 3.136 7 7-3.136 7-7 7-7-3.136-7-7Z"
      stroke="currentColor"
      strokeWidth={2}
    />
    <rect
      x={9}
      y={9}
      width={2}
      height={5}
      rx={1}
      transform="rotate(-180 9 9)"
      fill="currentColor"
    />
    <rect
      x={9}
      y={12}
      width={2}
      height={2}
      rx={1}
      transform="rotate(-180 9 12)"
      fill="currentColor"
    />
  </svg>
);

export default SvgNotice;
