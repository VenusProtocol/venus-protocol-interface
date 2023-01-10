import * as React from 'react';
import { SVGProps } from 'react';

const SvgPredictions = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={10} cy={10} r={9} stroke="currentColor" strokeWidth={2} />
    <path
      d="m14.956 7.938-3.754 6.503a1.29 1.29 0 0 1-2.237 0l-.658-1.14a.013.013 0 0 1 .021-.015 1.081 1.081 0 0 0 1.695-.225l3.143-5.449a1.082 1.082 0 0 0-.67-1.59.013.013 0 0 1 .01-.022h1.332a1.292 1.292 0 0 1 1.118 1.938ZM10.512 6H9.21a.013.013 0 0 0-.009.013.013.013 0 0 0 .01.012.653.653 0 0 1 .33.933l-1.896 3.281a.654.654 0 0 1-1.007.152c-.003 0-.007 0-.01.003a.013.013 0 0 0-.003.019l.667 1.156a.854.854 0 0 0 1.477 0l2.482-4.29A.852.852 0 0 0 10.511 6ZM5.994 6a1.123 1.123 0 1 0 0 2.246 1.123 1.123 0 0 0 0-2.246Z"
      fill="currentColor"
    />
    <path
      d="m17 16.5 5 5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgPredictions;
