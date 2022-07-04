import * as React from 'react';
import { SVGProps } from 'react';

const SvgMedium = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1.9 2.6c0-.2-.1-.4-.2-.5L.2.3V0h4.6l3.6 7.9L11.6 0H16v.3l-1.3 1.2c-.1.1-.2.2-.1.4v9c0 .1 0 .3.1.4l1.2 1.2v.3H9.6v-.3l1.3-1.3c.1-.1.1-.2.1-.4V3.5l-3.6 9.1H7L2.8 3.5v6.1c0 .3.1.5.2.7l1.7 2v.3H0v-.3l1.7-2c.2-.2.3-.4.2-.7v-7Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMedium;
