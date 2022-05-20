import * as React from 'react';
import { SVGProps } from 'react';

const SvgXrp = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#2C333A" />
    <path
      d="M16.242 7h1.735l-3.61 3.574a3.373 3.373 0 0 1-4.734 0L6.022 7h1.736L10.5 9.715a2.136 2.136 0 0 0 2.998 0L16.242 7ZM7.736 16.938H6l3.633-3.596a3.373 3.373 0 0 1 4.734 0L18 16.937h-1.734L13.5 14.201a2.135 2.135 0 0 0-2.998 0l-2.766 2.736Z"
      fill="#fff"
    />
  </svg>
);

export default SvgXrp;
