import * as React from 'react';
import { SVGProps } from 'react';

const SvgLongArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m.667 6 .94.94 3.726-3.72v8.113h1.334V3.22l3.72 3.727.946-.947L6 .667.667 6Z" />
  </svg>
);

export default SvgLongArrow;
