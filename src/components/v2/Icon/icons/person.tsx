import * as React from 'react';
import { SVGProps } from 'react';

const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#clip0_7457_60846)">
      <path
        d="M1 13.3333C1 11.4924 2.49238 10 4.33333 10H11.6667C13.5076 10 15 11.4924 15 13.3333V13.3333C15 14.2538 14.2538 15 13.3333 15H2.66667C1.74619 15 1 14.2538 1 13.3333V13.3333Z"
        stroke="#9597A2"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="4" r="3" stroke="#9597A2" strokeWidth="2" />
    </g>
    <defs>
      <clipPath id="clip0_7457_60846">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgPerson;
