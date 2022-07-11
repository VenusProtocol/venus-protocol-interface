import * as React from 'react';
import { SVGProps } from 'react';

const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x={1} y={4} width={20} height={17} rx={5} stroke="currentColor" strokeWidth={2} />
    <path
      d="M17.5 9h3.564c.517 0 .936.419.936.935v5.13a.935.935 0 0 1-.936.935H17.5a3.5 3.5 0 1 1 0-7Z"
      stroke="currentColor"
      strokeWidth={2}
    />
  </svg>
);

export default SvgWallet;
