import * as React from 'react';
import { SVGProps } from 'react';

const SvgVrt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#F8DA49" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.108 11.216 9.5 8H7l5 10 1.218-2.437-2.117-4.344.007-.003Zm1.44.689 1.234 2.532L17 8h-2.5l-1.953 3.905Z"
      fill="#000"
    />
  </svg>
);

export default SvgVrt;
