import type { SVGProps } from 'react';

const SvgLido = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask id="mask0_11693_1417" maskUnits="userSpaceOnUse" x="3" y="10" width="18" height="14">
      <path
        d="M11.5704 14.8042L4.5346 10.7874L4.34512 11.0779C2.18512 14.4 2.66512 18.7453 5.50723 21.5369C8.8546 24.8211 14.2862 24.8211 17.6335 21.5369C20.4756 18.7453 20.9557 14.4 18.7956 11.0779L18.6062 10.7874L11.5704 14.8042Z"
        fill="white"
      />
    </mask>

    <g mask="url(#mask0_11693_1417)">
      <path
        d="M19.1472 15.6758C19.1472 19.8603 15.755 23.2526 11.5704 23.2526C7.38581 23.2526 3.99355 19.8603 3.99355 15.6758C3.99355 11.4912 7.38581 8.09892 11.5704 8.09892C15.755 8.09892 19.1472 11.4912 19.1472 15.6758Z"
        stroke="currentColor"
        stroke-width="2"
      />
    </g>

    <path
      d="M11.5 11.8423L6.89864 9.15817L11.5 1.87268L16.1014 9.15817L11.5 11.8423Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
);

export default SvgLido;
