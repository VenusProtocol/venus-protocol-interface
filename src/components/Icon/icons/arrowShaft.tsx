import * as React from 'react';
import { SVGProps } from 'react';

const SvgArrowShaft = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m8 2.667-.94.94 3.72 3.726H2.667v1.333h8.113l-3.726 3.72.946.947L13.334 8 8 2.667Z" />
  </svg>
);

export default SvgArrowShaft;
