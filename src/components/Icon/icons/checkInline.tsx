import * as React from 'react';
import { SVGProps } from 'react';

const SvgCheckInline = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1 8c0-3.864 3.136-7 7-7s7 3.136 7 7-3.136 7-7 7-7-3.136-7-7Z"
      stroke="currentColor"
      strokeWidth={2}
    />
    <path
      d="M6 8.5 7.5 10 11 6.5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgCheckInline;
