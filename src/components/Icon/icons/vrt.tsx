import * as React from 'react';
import { SVGProps } from 'react';

const SvgVrt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={10} cy={10} r={10} fill="#F8DA49" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.108 9.216 7.5 6H5l5 10 1.218-2.437L9.101 9.22l.007-.003Zm1.44.689 1.234 2.532L15 6h-2.5l-1.953 3.905Z"
      fill="#000"
    />
  </svg>
);

export default SvgVrt;
