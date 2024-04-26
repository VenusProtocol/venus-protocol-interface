import type { SVGProps } from 'react';

const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g id="Arrow">
      <path
        id="Vector"
        d="M13.825 13.8394L10 10.0227L6.175 13.8394L5 12.6644L10 7.66436L15 12.6644L13.825 13.8394Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

export default SvgArrowUp;
