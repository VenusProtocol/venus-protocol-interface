import type { SVGProps } from 'react';

const SvgTransactionFile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 1.625C8.41419 1.62503 8.75 1.96081 8.75 2.375V11.8135L11.0049 9.55859C11.2977 9.26604 11.7726 9.26601 12.0654 9.55859C12.3583 9.85149 12.3583 10.3272 12.0654 10.6201L8.53027 14.1553C8.23738 14.4482 7.76164 14.4482 7.46875 14.1553L3.93359 10.6201C3.6407 10.3272 3.6407 9.85149 3.93359 9.55859C4.22639 9.26597 4.70128 9.26608 4.99414 9.55859L7.25 11.8145V2.375C7.25 1.96079 7.58579 1.625 8 1.625Z"
      fill="#AAB3CA"
    />
  </svg>
);

export default SvgTransactionFile;
