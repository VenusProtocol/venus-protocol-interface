import * as React from 'react';
import { SVGProps } from 'react';

const SvgEth = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#EDEFF0" />
    <path
      opacity={0.6}
      d="m11.997 15.051 4.803-2.903-4.803-2.23-4.797 2.23 4.797 2.903Z"
      fill="#000"
    />
    <path opacity={0.45} d="M11.997 9.919V4L7.2 12.148l4.797 2.903V9.919Z" fill="#000" />
    <path opacity={0.8} d="m11.997 15.051 4.803-2.903L11.997 4V15.051Z" fill="#000" />
    <path opacity={0.45} d="M11.997 15.98 7.2 13.081 11.997 20v-4.02Z" fill="#000" />
    <path opacity={0.8} d="m16.8 13.082-4.803 2.897V20l4.803-6.918Z" fill="#000" />
  </svg>
);

export default SvgEth;
