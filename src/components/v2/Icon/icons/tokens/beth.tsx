import * as React from 'react';
import { SVGProps } from 'react';

const SvgBeth = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#EDEFF0" />
    <path
      d="M17.077 12.713c-1.79.925-3.657 1.892-5.1 2.64l-5.057-2.64C8.75 15.36 10.277 17.562 11.978 20c1.703-2.433 3.584-5.116 5.099-7.287Zm-.195-.73-4.91-2.548-4.846 2.53 4.843 2.551 4.913-2.532ZM11.978 8.62l5.099 2.61L12 4l-5.08 7.246 5.058-2.627Z"
      fill="#657ABD"
    />
    <path d="m16.882 11.984-4.91-2.549-4.846 2.53 4.843 2.551 4.913-2.532Z" fill="#9C68AA" />
    <path d="m11.978 8.619 5.099 2.61L12 4l-5.08 7.246 5.058-2.627Z" fill="#F48975" />
    <path d="M11.978 8.62 12 4l-5.08 7.246 5.058-2.627Z" fill="#F8EC66" />
    <path d="m7.126 11.965 4.846-2.53-.003 5.081-4.843-2.551Z" fill="#50BA78" />
    <path d="m11.978 15.354-5.058-2.64C8.751 15.36 11.978 20 11.978 20v-4.646Z" fill="#10AED3" />
  </svg>
);

export default SvgBeth;
