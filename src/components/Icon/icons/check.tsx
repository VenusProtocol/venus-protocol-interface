import * as React from 'react';
import { SVGProps } from 'react';

const SvgCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 65 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth={4}
    {...props}
  >
    <circle cx={32.5} cy={32} r={24} fill="currentColor" />
    <path
      d="m41.5 26-12 12-6-6"
      stroke="#fff"
      strokeWidth="inherit"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgCheck;
