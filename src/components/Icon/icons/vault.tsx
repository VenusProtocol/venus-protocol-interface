import * as React from 'react';
import { SVGProps } from 'react';

const SvgVault = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x={7} y={20} width={2} height={4} rx={1} fill="currentColor" />
    <rect x={15} y={20} width={2} height={4} rx={1} fill="currentColor" />
    <circle cx={12} cy={11} r={4} stroke="currentColor" strokeWidth={2} />
    <circle cx={12} cy={11} r={1} fill="currentColor" />
    <rect
      x={6.343}
      y={15.243}
      width={3}
      height={2}
      rx={1}
      transform="rotate(-45 6.343 15.243)"
      fill="currentColor"
    />
    <rect
      x={7.757}
      y={5.343}
      width={3}
      height={2}
      rx={1}
      transform="rotate(45 7.757 5.343)"
      fill="currentColor"
    />
    <rect
      x={14.121}
      y={7.464}
      width={3}
      height={2}
      rx={1}
      transform="rotate(-45 14.121 7.464)"
      fill="currentColor"
    />
    <rect
      x={15.536}
      y={13.121}
      width={3}
      height={2}
      rx={1}
      transform="rotate(45 15.536 13.121)"
      fill="currentColor"
    />
    <rect x={2} y={1} width={20} height={20} rx={5} stroke="currentColor" strokeWidth={2} />
  </svg>
);

export default SvgVault;
