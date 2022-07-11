import * as React from 'react';
import { SVGProps } from 'react';

const SvgCountdown = ({ id, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g
      clipPath={`url(#${id})`}
      stroke="currentColor"
      strokeWidth={1.333}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.967a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333Z" />
      <path d="M8.5 4.3v4l2.667 1.334" />
    </g>
    <defs>
      <clipPath id={id}>
        <path fill="#fff" transform="translate(.5 .3)" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgCountdown;
