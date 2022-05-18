import * as React from 'react';
import { SVGProps } from 'react';

const SvgBnb = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx={12} cy={12} r={10} fill="#F3BA2F" />
    <path
      d="M8.893 10.723 12 7.616l3.109 3.109 1.808-1.808L12 4 7.085 8.915l1.808 1.808ZM7.616 12l-1.808-1.808L4 12l1.808 1.808L7.616 12ZM8.892 13.277 12 16.384l3.108-3.109 1.81 1.807-.002.001L12 20l-4.916-4.915-.002-.003 1.81-1.805ZM18.192 13.809 20 12l-1.808-1.808L16.384 12l1.808 1.808Z"
      fill="#fff"
    />
    <path
      d="M13.834 12 12 10.163l-1.356 1.356-.156.156-.321.321-.003.003.003.003L12 13.836 13.834 12l.001-.001h-.002Z"
      fill="#fff"
    />
  </svg>
);

export default SvgBnb;
