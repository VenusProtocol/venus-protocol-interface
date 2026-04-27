import type { SVGProps } from 'react';

const SvgSunset = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_sunset)">
      <rect
        x="11"
        y="15"
        width="2"
        height="2"
        rx="1"
        transform="rotate(-180 11 15)"
        fill="currentColor"
      />
      <rect x="9" y="7" width="2" height="5" rx="1" fill="currentColor" />
      <path
        d="M8.26795 4C9.03775 2.66667 10.9623 2.66667 11.7321 4L17.7942 14.5C18.564 15.8333 17.6018 17.5 16.0622 17.5H3.93782C2.39822 17.5 1.43597 15.8333 2.20577 14.5L8.26795 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </g>
    <defs>
      <clipPath id="clip0_sunset">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgSunset;
