import * as React from 'react';
import { SVGProps } from 'react';

const SvgTusd = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#2F5EF5" />
    <path
      d="M6 6.2h4.053L0 0l10.053 6.2A4.053 4.053 0 0 1 6 10.253L0 0l6 10.253V6.2ZM17.855 10.253V6.2h-3.894a4.053 4.053 0 0 0-4.053 4.053V18.2h4.053v-7.947h3.894Z"
      fill="#fff"
    />
  </svg>
);

export default SvgTusd;
