import * as React from 'react';
import { SVGProps } from 'react';

const SvgMask = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x={1} y={1} width={22} height={22} rx={6} fill="currentColor" />
  </svg>
);

export default SvgMask;
