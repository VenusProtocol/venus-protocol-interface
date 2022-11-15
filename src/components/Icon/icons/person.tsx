import * as React from 'react';
import { SVGProps } from 'react';

const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 20C1 16.134 4.13401 13 8 13H16C19.866 13 23 16.134 23 20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20ZM8 15C5.23858 15 3 17.2386 3 20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20C21 17.2386 18.7614 15 16 15H8Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3C10.3431 3 9 4.34315 9 6C9 7.65685 10.3431 9 12 9C13.6569 9 15 7.65685 15 6C15 4.34315 13.6569 3 12 3ZM7 6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6C17 8.76142 14.7614 11 12 11C9.23858 11 7 8.76142 7 6Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgPerson;
