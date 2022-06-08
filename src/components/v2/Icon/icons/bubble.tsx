import * as React from 'react';
import { SVGProps } from 'react';

const SvgBubble = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 9.15705 1.28072 10.2485 1.77778 11.21L1 15L4.78995 14.2222C5.75147 14.7193 6.84295 15 8 15Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgBubble;
