import * as React from 'react';
import { SVGProps } from 'react';

const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M17 1H5c-1.1 0-2 .9-2 2v14h2V3h12V1Zm3 4H9c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H9V7h11v14Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgCopy;
