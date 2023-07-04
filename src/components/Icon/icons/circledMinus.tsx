import * as React from 'react';
import { SVGProps } from 'react';

const SvgCircledMinus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="0.75"
      y="0.75"
      width="14.5"
      height="14.5"
      rx="7.25"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M10.9995 8.00002L7.99982 8.00002H5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgCircledMinus;
