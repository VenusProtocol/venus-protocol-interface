import type { SVGProps } from 'react';

const SvgOuterArrows = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.66699 2.6665H5.33366M6.00033 5.99984L2.66699 2.6665L6.00033 5.99984ZM2.66699 2.6665V5.33317V2.6665Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.3333 2.6665H10.6667M10 5.99984L13.3333 2.6665L10 5.99984ZM13.3333 2.6665V5.33317V2.6665Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M2.66699 13.3333H5.33366M6.00033 10L2.66699 13.3333L6.00033 10ZM2.66699 13.3333V10.6667V13.3333Z"
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

export default SvgOuterArrows;
