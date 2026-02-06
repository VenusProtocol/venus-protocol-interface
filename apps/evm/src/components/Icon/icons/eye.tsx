import type { SVGProps } from 'react';

const SvgEye = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.99967 11.6668C10.9202 11.6668 11.6663 10.9207 11.6663 10.0002C11.6663 9.07966 10.9202 8.3335 9.99967 8.3335C9.07917 8.3335 8.33301 9.07966 8.33301 10.0002C8.33301 10.9207 9.07917 11.6668 9.99967 11.6668Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17.5 10C15.9262 12.4925 13.0986 15 10 15C6.90142 15 4.0738 12.4925 2.5 10C4.41546 7.63188 6.65969 5 10 5C13.3403 5 15.5846 7.63183 17.5 10Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgEye;
