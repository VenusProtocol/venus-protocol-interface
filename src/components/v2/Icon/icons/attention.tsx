import * as React from 'react';
import { SVGProps } from 'react';

const SvgAttention = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 8.25v5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    <rect
      x={13.25}
      y={18.25}
      width={2.5}
      height={2.5}
      rx={1.25}
      transform="rotate(-180 13.25 18.25)"
      fill="currentColor"
    />
    <path
      d="M20.837 17.552 13.76 4.412c-.755-1.403-2.767-1.403-3.522 0l-7.076 13.14c-.717 1.332.248 2.948 1.761 2.948h14.152c1.513 0 2.478-1.616 1.76-2.948Z"
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);

export default SvgAttention;
