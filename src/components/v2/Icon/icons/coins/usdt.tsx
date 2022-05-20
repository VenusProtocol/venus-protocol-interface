import * as React from 'react';
import { SVGProps } from 'react';

const SvgUsdt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
      fill="#1BA27A"
    />
    <path d="M16.691 7.043H7.222v2.286h3.592v3.36H13.1v-3.36h3.591V7.043Z" fill="#fff" />
    <path
      d="M11.978 13.047c-2.971 0-5.38-.47-5.38-1.05 0-.58 2.409-1.051 5.38-1.051 2.97 0 5.38.47 5.38 1.05 0 .58-2.41 1.05-5.38 1.05Zm6.04-.876c0-.748-2.704-1.354-6.04-1.354s-6.04.606-6.04 1.354c0 .66 2.096 1.208 4.875 1.33v4.823H13.1v-4.822c2.8-.117 4.92-.668 4.92-1.33Z"
      fill="#fff"
    />
  </svg>
);

export default SvgUsdt;
