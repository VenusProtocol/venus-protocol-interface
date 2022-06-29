import * as React from 'react';
import { SVGProps } from 'react';

const SvgLtc = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 20.918a8.918 8.918 0 1 0 0-17.836 8.918 8.918 0 0 0 0 17.836Z" fill="#fff" />
    <path
      d="M12 2a10 10 0 1 0 10 10 9.97 9.97 0 0 0-9.942-10H12Zm.17 10.339-1.042 3.51h5.57a.282.282 0 0 1 .29.272v.092l-.484 1.67a.36.36 0 0 1-.364.267H7.617l1.429-4.867-1.598.485.363-1.114 1.598-.485 2.01-6.828a.366.366 0 0 1 .363-.266h2.155a.281.281 0 0 1 .29.271v.092l-1.694 5.763 1.598-.484-.34 1.162-1.622.46Z"
      fill="#345D9D"
    />
  </svg>
);

export default SvgLtc;
