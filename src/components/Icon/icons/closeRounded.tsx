import * as React from 'react';
import { SVGProps } from 'react';

const SvgCloseRounded = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#fff" d="M0 12.799 12.728.07l1.414 1.414L1.414 14.213z" />
    <path fill="#fff" d="m1.414 0 12.728 12.728-1.414 1.414L0 1.414z" />
  </svg>
);

export default SvgCloseRounded;
