import * as React from 'react';
import { SVGProps } from 'react';

const SvgBurger = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fill="#fff" d="M0 0h18v2H0zM0 5h18v2H0zM0 10h18v2H0z" />
  </svg>
);

export default SvgBurger;
