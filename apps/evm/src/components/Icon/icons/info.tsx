import type { SVGProps } from 'react';

const SvgInfo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="8" cy="8.33936" r="6.4" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M7.34546 5.71763C7.34546 5.33073 7.6591 5.01709 8.046 5.01709C8.43289 5.01709 8.74653 5.33073 8.74653 5.71763C8.74653 6.10452 8.43289 6.41816 8.046 6.41816C7.6591 6.41816 7.34546 6.10452 7.34546 5.71763Z"
      fill="currentColor"
    />
    <rect x="7.4458" y="7.51807" width="1.2" height="4.15425" rx="0.6" fill="currentColor" />
  </svg>
);

export default SvgInfo;
