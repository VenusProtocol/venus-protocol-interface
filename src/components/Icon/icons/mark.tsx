import * as React from 'react';
import { SVGProps } from 'react';

const SvgMark = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M13 1 5 9 1 5"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgMark;
