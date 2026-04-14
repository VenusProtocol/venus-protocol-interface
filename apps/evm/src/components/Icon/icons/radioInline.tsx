import type { SVGProps } from 'react';

const RadioInline = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
    <circle cx="10" cy="10" r="4" fill="currentColor" />
  </svg>
);

export default RadioInline;
