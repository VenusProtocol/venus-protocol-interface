import * as React from 'react';
import { SVGProps } from 'react';

const SvgLightening = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_9964_85128)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.9862 9.73267L2.7627 9.73268L9.45933 2V8.26712L13.6828 8.26711L6.9862 15.9998L6.9862 9.73267Z"
        fill="#FECA00"
      />
    </g>
    <defs>
      <clipPath id="clip0_9964_85128">
        <rect width="16" height="16" fill="currentColor" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgLightening;
