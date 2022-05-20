import * as React from 'react';
import { SVGProps } from 'react';

const SvgConvert = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.667 7.333H20M16 4l4 3.314-4 3.353M17.333 16.667H4M8 20l-4-3.314 4-3.352"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgConvert;
