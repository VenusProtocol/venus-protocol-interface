import * as React from 'react';
import { SVGProps } from 'react';

const SvgShield = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8 14.667S13.333 12 13.333 8V3.333L8 1.333l-5.333 2V8C2.667 12 8 14.667 8 14.667Z"
      fill="#18DF8B"
    />
    <path d="M12 8c0 3-4 5-4 5V3l4 1.5V8Z" fill="#049F5E" />
  </svg>
);

export default SvgShield;
