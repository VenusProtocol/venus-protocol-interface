import type { SVGProps } from 'react';

const Document = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="3.65"
      y="2.65"
      width="12.7"
      height="14.7"
      rx="3.35"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <rect x="6.31592" y="6.3999" width="7.36847" height="1.3" rx="0.65" fill="currentColor" />
    <rect x="6.31592" y="9.3999" width="7.36847" height="1.3" rx="0.65" fill="currentColor" />
    <rect x="6.31592" y="12.3999" width="7.36847" height="1.3" rx="0.65" fill="currentColor" />
  </svg>
);

export default Document;
