import * as React from 'react';
import { SVGProps } from 'react';

const SvgOpen = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.667 13.167H3.333V3.833H8V2.5H3.333C2.593 2.5 2 3.1 2 3.833v9.334c0 .733.593 1.333 1.333 1.333h9.334c.733 0 1.333-.6 1.333-1.333V8.5h-1.333v4.667ZM9.333 2.5v1.333h2.394l-6.554 6.554.94.94 6.554-6.554v2.394H14V2.5H9.333Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgOpen;
