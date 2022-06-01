import * as React from 'react';
import { SVGProps } from 'react';

const SvgExclamation = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 3 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="1.5" cy="16.5" r="1.5" fill="currentColor" />
    <rect x="0.5" width="2" height="12" rx="1" fill="currentColor" />
  </svg>
);

export default SvgExclamation;
