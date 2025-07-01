import type { SVGProps } from 'react';

const SvgDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 11.1733V16.1733C3 17.8302 4.34315 19.1733 6 19.1733H18C19.6569 19.1733 21 17.8302 21 16.1733V11.1733"
      stroke="#AAB3CA"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path d="M12 4.17334L12 14.1733" stroke="#AAB3CA" stroke-width="2" stroke-linecap="round" />
    <path
      d="M15.5356 11.7089L12.0001 15.2444L8.46458 11.7089"
      stroke="#AAB3CA"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default SvgDownload;
