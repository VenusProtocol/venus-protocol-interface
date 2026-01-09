import type { SVGProps } from 'react';

const SvgUser = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2 12C2 10.3431 3.34315 9 5 9H9C10.6569 9 12 10.3431 12 12C12 12.5523 11.5523 13 11 13H3C2.44772 13 2 12.5523 2 12Z"
      stroke="currentColor"
      stroke-linejoin="round"
    />

    <ellipse cx="7" cy="5" rx="2" ry="2" stroke="currentColor" />
  </svg>
);

export default SvgUser;
