import * as React from 'react';
import { SVGProps } from 'react';

const SvgVote = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x={2} y={2} width={8} height={8} rx={1} stroke="currentColor" strokeWidth={2} />
    <rect x={2} y={14} width={8} height={8} rx={1} stroke="currentColor" strokeWidth={2} />
    <rect x={14} y={2} width={8} height={8} rx={1} stroke="currentColor" strokeWidth={2} />
    <rect x={14} y={14} width={8} height={8} rx={1} stroke="currentColor" strokeWidth={2} />
  </svg>
);

export default SvgVote;
