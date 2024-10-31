import type { SVGProps } from 'react';

const SvgComment = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clip-path="url(#clip0_65_2551)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14 8C14 11.3137 11.3137 14 8 14C7.00825 14 6.07269 13.7594 5.24853 13.3333L2 14L2.66667 10.7515C2.24062 9.92731 2 8.99175 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM5 9C5.55228 9 6 8.55228 6 8C6 7.44772 5.55228 7 5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9ZM9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8ZM11 9C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9Z"
        fill="#AAB3CA"
      />
    </g>
    <defs>
      <clipPath id="clip0_65_2551">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgComment;
