import { type SVGProps, useId } from 'react';

const SvgBarChart = (props: SVGProps<SVGSVGElement>) => {
  const maskId = `bar-chart-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <mask id={maskId} fill="white">
        <rect x="14" y="2" width="8" height="20" rx="1.49998" />
      </mask>
      <rect
        x="14"
        y="2"
        width="8"
        height="20"
        rx="1.49998"
        stroke="currentColor"
        strokeWidth="4"
        mask={`url(#${maskId})`}
      />
      <path
        d="M9.5 10H14.5C14.7761 10 15 10.2239 15 10.5V21H9.5C9.22387 21 9 20.7761 9 20.5V10.5C9 10.2239 9.22387 10 9.5 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3.5 16H8.5C8.77613 16 9 16.2239 9 16.5V21H3.5C3.22387 21 3 20.7761 3 20.5V16.5C3 16.2239 3.22387 16 3.5 16Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export default SvgBarChart;
