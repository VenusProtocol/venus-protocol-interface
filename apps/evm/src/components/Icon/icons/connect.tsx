import type { SVGProps } from 'react';

const SvgConnect = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10 2.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

    <path
      d="M6.60849 4.5C4.4565 5.68277 3 7.95624 3 10.5667C3 14.3958 6.13401 17.5 10 17.5C13.866 17.5 17 14.3958 17 10.5667C17 7.95624 15.5435 5.68277 13.3915 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgConnect;
