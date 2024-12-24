import type { SVGProps } from 'react';

const SvgLink = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g clip-path="url(#clip0_2895_4)">
      <path
        d="M15.8333 15.8333H4.16667V4.16667H10V2.5H4.16667C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V10H15.8333V15.8333ZM11.6667 2.5V4.16667H14.6583L6.46667 12.3583L7.64167 13.5333L15.8333 5.34167V8.33333H17.5V2.5H11.6667Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_2895_4">
        <rect width="20" height="20" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgLink;
