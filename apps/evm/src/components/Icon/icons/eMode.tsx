import type { SVGProps } from 'react';

const EModeX = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="16" height="16" rx="8" fill="url(#paint0_linear_1404_12520)" />
    <path
      d="M4.23149 8.25475L9.99149 3.26451C10.2425 3.1029 10.4817 3.26451 10.3285 3.54174L8.49022 7.17662H11.7685C11.7685 7.17662 12.2894 7.17662 11.7685 7.60787L6.10043 12.6289C5.70213 12.9677 5.42639 12.7829 5.70213 12.2592L7.47915 8.71681H4.23149C4.23149 8.71681 3.71064 8.71681 4.23149 8.25475Z"
      fill="#1E2431"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1404_12520"
        x1="0"
        y1="8"
        x2="16"
        y2="8"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#00F5A0" />
        <stop offset="1" stop-color="#00D9F5" />
      </linearGradient>
    </defs>
  </svg>
);

export default EModeX;
