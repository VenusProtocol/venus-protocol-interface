import * as React from 'react';
import { SVGProps } from 'react';

const SvgFaucet = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m12 1.582 6.37 6.323a8.938 8.938 0 0 1 2.63 6.3c0 2.236-.88 4.598-2.63 6.338a9.017 9.017 0 0 1-6.37 2.63 9.017 9.017 0 0 1-6.37-2.63C3.88 18.803 3 16.441 3 14.205a8.939 8.939 0 0 1 2.63-6.3L12 1.582Z"
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);

export default SvgFaucet;
