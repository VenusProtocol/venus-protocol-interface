import type { SVGProps } from 'react';

const SvgLink = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="32" height="32" rx="8" fill="#181D27" fill-opacity="0.4" />
    <g clip-path="url(#clip0_2835_31268)">
      <path
        d="M21.8333 21.8333H10.1667V10.1667H16V8.5H10.1667C9.24167 8.5 8.5 9.25 8.5 10.1667V21.8333C8.5 22.75 9.24167 23.5 10.1667 23.5H21.8333C22.75 23.5 23.5 22.75 23.5 21.8333V16H21.8333V21.8333ZM17.6667 8.5V10.1667H20.6583L12.4667 18.3583L13.6417 19.5333L21.8333 11.3417V14.3333H23.5V8.5H17.6667Z"
        fill="#AAB3CA"
      />
    </g>
    <defs>
      <clipPath id="clip0_2835_31268">
        <rect width="20" height="20" fill="white" transform="translate(6 6)" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgLink;
