import type { SVGProps } from 'react';

const SvgExpand = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.6665 2.66675H5.33317M5.99984 6.00008L2.6665 2.66675L5.99984 6.00008ZM2.6665 2.66675V5.33341V2.66675Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.3333 2.66675H10.6667M10 6.00008L13.3333 2.66675L10 6.00008ZM13.3333 2.66675V5.33341V2.66675Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M2.6665 13.3333H5.33317M5.99984 10L2.6665 13.3333L5.99984 10ZM2.6665 13.3333V10.6667V13.3333Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.3333 13.3333H10.6667M10 10L13.3333 13.3333L10 10ZM13.3333 13.3333V10.6667V13.3333Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgExpand;
