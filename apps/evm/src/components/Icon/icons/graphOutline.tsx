import type { SVGProps } from 'react';

const SvgGraphOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask id="path-1-inside-1_1334_21006" fill="white">
      <rect x="12" width="8" height="20" rx="1.49998" />
    </mask>
    <rect
      x="12"
      width="8"
      height="20"
      rx="1.49998"
      stroke="currentColor"
      stroke-width="4"
      mask="url(#path-1-inside-1_1334_21006)"
    />
    <path
      d="M7.5 8H12.5C12.7761 8 13 8.22387 13 8.5V19H7.5C7.22387 19 7 18.7761 7 18.5V8.5C7 8.22387 7.22387 8 7.5 8Z"
      stroke="currentColor"
      stroke-width="2"
    />
    <path
      d="M1.5 14H6.5C6.77613 14 7 14.2239 7 14.5V19H1.5C1.22387 19 1 18.7761 1 18.5V14.5C1 14.2239 1.22387 14 1.5 14Z"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
);

export default SvgGraphOutline;
