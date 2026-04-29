import type { SVGProps } from 'react';

const SvgProtectionShield = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_protection_shield)">
      <path
        d="M14.8941 3.23181C14.7304 3.24011 14.5656 3.24431 14.3998 3.24431C11.941 3.24431 9.69818 2.31996 7.99975 0.799805C6.30134 2.3199 4.05851 3.24422 1.5998 3.24422C1.43402 3.24422 1.26923 3.24001 1.10551 3.23171C0.905969 4.0026 0.799805 4.81107 0.799805 5.64434C0.799805 10.1176 3.85926 13.8762 7.99981 14.9419C12.1404 13.8762 15.1998 10.1176 15.1998 5.64434C15.1998 4.81111 15.0936 4.00267 14.8941 3.23181Z"
        stroke="#00C38E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8L7 10L11 6"
        stroke="#00A87A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_protection_shield">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default SvgProtectionShield;
