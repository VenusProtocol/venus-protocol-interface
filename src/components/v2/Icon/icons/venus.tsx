import * as React from 'react';
import { SVGProps } from 'react';

const SvgVenus = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="m11.797 2.768-4.391 7.606a1.511 1.511 0 0 1-2.617 0l-.77-1.332a.016.016 0 0 1 .025-.019 1.265 1.265 0 0 0 1.983-.263l3.676-6.374A1.265 1.265 0 0 0 8.92.526.016.016 0 0 1 8.931.5h1.559a1.512 1.512 0 0 1 1.307 2.268ZM6.598.5H5.076a.016.016 0 0 0 0 .03.764.764 0 0 1 .388 1.09L3.244 5.46a.765.765 0 0 1-1.177.178.016.016 0 0 0-.015.025l.78 1.352a.997.997 0 0 0 1.728 0l2.903-5.018A.997.997 0 0 0 6.598.5ZM1.314.5a1.314 1.314 0 1 0 0 2.628 1.314 1.314 0 0 0 0-2.628Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgVenus;
