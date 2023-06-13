import * as React from 'react';
import { SVGProps } from 'react';

const SvgAttention = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_10899_4570)">
      <path
        d="M11 14C11 14.5523 10.5523 15 10 15V15C9.44772 15 9 14.5523 9 14V14C9 13.4477 9.44772 13 10 13V13C10.5523 13 11 13.4477 11 14V14Z"
        fill="currentColor"
      />
      <path
        d="M9 8C9 7.44772 9.44772 7 10 7V7C10.5523 7 11 7.44772 11 8V11C11 11.5523 10.5523 12 10 12V12C9.44772 12 9 11.5523 9 11V8Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.40193 3.5C8.55663 1.5 11.4434 1.5 12.5981 3.5L18.6603 14C19.815 16 18.3716 18.5 16.0622 18.5H3.93783C1.62843 18.5 0.185048 16 1.33975 14L7.40193 3.5ZM10.866 4.5C10.4811 3.83333 9.51888 3.83333 9.13398 4.5L3.0718 15C2.6869 15.6667 3.16802 16.5 3.93783 16.5H16.0622C16.832 16.5 17.3131 15.6667 16.9282 15L10.866 4.5Z"
        fill="currentColor"
      />
    </g>

    <defs>
      <clipPath id="clip0_10899_4570">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgAttention;
