import type { SVGProps } from 'react';

const SvgParachute = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clip-path="url(#clip0_1123_2459)">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.49449 7.27273H14.5055C14.1437 4.00004 11.3691 1.45455 8 1.45455C4.63087 1.45455 1.85627 4.00004 1.49449 7.27273ZM13.5169 8.72727H10.7229L9.5255 12.7187L13.5169 8.72727ZM7.90182 13.069L9.20434 8.72727H6.16512L7.90182 13.069ZM4.59852 8.72727H2.48306L6.00883 12.253L4.59852 8.72727ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 8.19289 15.9234 8.37787 15.787 8.51426L8.51426 15.787C8.23024 16.071 7.76976 16.071 7.48574 15.787L0.213013 8.51426C0.0766231 8.37787 0 8.19289 0 8Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1123_2459">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgParachute;
