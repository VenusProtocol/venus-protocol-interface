import * as React from 'react';
import { SVGProps } from 'react';

const SvgXvs = ({ id, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={30} cy={30} r={30} fill="#1F2028" />
    <path
      d="m47.392 23.605-13.175 22.82a4.536 4.536 0 0 1-7.85 0l-2.31-3.996a.047.047 0 0 1 .076-.057 3.797 3.797 0 0 0 5.947-.79L41.109 22.46a3.795 3.795 0 0 0-2.315-5.564.047.047 0 0 1 0-.093h4.676a4.534 4.534 0 0 1 3.922 6.802Zm-15.597-6.802h-4.567a.047.047 0 0 0 0 .089 2.29 2.29 0 0 1 1.164 3.272L21.734 31.68a2.296 2.296 0 0 1-3.502.551.046.046 0 0 0-.065-.009.046.046 0 0 0-.01.066l2.338 4.058a2.993 2.993 0 0 0 5.185 0l8.71-15.055a2.992 2.992 0 0 0-2.595-4.488Zm-15.854 0a3.941 3.941 0 1 0 0 7.883 3.941 3.941 0 0 0 0-7.883Z"
      fill={`url(#${id})`}
    />
    <defs>
      <linearGradient
        id={id}
        x1={47.539}
        y1={42.036}
        x2={6.376}
        y2={14.082}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5433FF" />
        <stop offset={0.5} stopColor="#20BDFF" />
        <stop offset={1} stopColor="#5CFFA2" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgXvs;
