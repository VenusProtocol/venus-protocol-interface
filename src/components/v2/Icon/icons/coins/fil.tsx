import * as React from 'react';
import { SVGProps } from 'react';

const SvgFil = ({ id, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <mask
      id={id}
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={2}
      y={2}
      width={20}
      height={20}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M2 2h20v20H2V2Z" fill="#fff" />
    </mask>
    <g mask={`url(#${id})`} fillRule="evenodd" clipRule="evenodd">
      <path
        d="M12 22C6.5 22 2 17.5 2 11.95c.05-5.5 4.5-10 10.05-9.95 5.5.05 9.95 4.5 9.95 10.1-.05 5.45-4.5 9.9-10 9.9Z"
        fill="#0090FF"
      />
      <path
        d="m12.95 10.8-.3 1.6 2.85.4-.2.75-2.8-.4c-.2.65-.3 1.35-.55 1.95-.25.7-.5 1.4-.8 2.05-.4.85-1.1 1.45-2.05 1.6-.55.1-1.15.05-1.6-.3-.15-.1-.3-.3-.3-.45 0-.2.1-.45.25-.55.1-.05.35 0 .5.05.15.15.3.35.4.55.3.4.7.45 1.1.15.45-.4.7-.95.85-1.5.3-1.2.6-2.35.85-3.55v-.2l-2.65-.4.1-.75 2.75.4.35-1.55-2.85-.45.1-.8 2.95.4c.1-.3.15-.55.25-.8.25-.9.5-1.8 1.1-2.6.6-.8 1.3-1.3 2.35-1.25.45 0 .9.15 1.2.5.05.05.15.15.15.25 0 .2 0 .45-.15.6-.2.15-.45.1-.65-.1-.15-.15-.25-.3-.4-.45-.3-.4-.75-.45-1.1-.1-.25.25-.5.6-.65.95-.35 1.05-.6 2.15-.95 3.25l2.75.4-.2.75-2.65-.4Z"
        fill="#fff"
      />
    </g>
  </svg>
);

export default SvgFil;
