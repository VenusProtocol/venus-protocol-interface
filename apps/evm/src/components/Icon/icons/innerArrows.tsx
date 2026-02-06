import type { SVGProps } from 'react';

const SvgInnerArrows = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M2.66667 2.66667L6 6M6 6L6 3.33333M6 6L3.33333 6"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.99967 6L12.6663 6M13.333 2.66667L9.99967 6L13.333 2.66667ZM9.99967 6L9.99967 3.33333L9.99967 6Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 10.0002L3.33333 10.0002M2.66667 13.3335L6 10.0002L2.66667 13.3335ZM6 10.0002L6 12.6668L6 10.0002Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.99967 10.0002L12.6663 10.0002M13.333 13.3335L9.99967 10.0002L13.333 13.3335ZM9.99967 10.0002L9.99967 12.6668L9.99967 10.0002Z"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgInnerArrows;
