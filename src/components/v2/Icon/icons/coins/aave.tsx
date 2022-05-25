import * as React from 'react';
import { SVGProps } from 'react';

const SvgAave = ({ id, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
      fill={`url(#${id})`}
    />
    <path
      d="M16.376 15.983 12.993 7.81a.91.91 0 0 0-.847-.63h-.3a.91.91 0 0 0-.847.63l-1.472 3.562H8.414a.61.61 0 0 0-.607.604v.008a.61.61 0 0 0 .607.604h.598l-1.404 3.396a.717.717 0 0 0-.041.232.639.639 0 0 0 .166.456.584.584 0 0 0 .45.174.608.608 0 0 0 .349-.116.738.738 0 0 0 .24-.307l1.545-3.834h1.072a.609.609 0 0 0 .607-.604v-.017a.609.609 0 0 0-.607-.604h-.572l1.179-2.94 3.216 8a.738.738 0 0 0 .24.306.608.608 0 0 0 .35.116.585.585 0 0 0 .449-.174.64.64 0 0 0 .166-.456.548.548 0 0 0-.041-.232Z"
      fill="#fff"
    />
    <defs>
      <linearGradient
        id={id}
        x1={20.14}
        y1={6.54}
        x2={5.26}
        y2={19.06}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B6509E" />
        <stop offset={1} stopColor="#2EBAC6" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgAave;
