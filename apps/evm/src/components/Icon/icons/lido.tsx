import type { SVGProps } from 'react';

const SvgLido = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.5877 0.774185C11.7863 0.484705 12.2136 0.484703 12.4122 0.774181L18.5455 9.71258L11.9996 13.2642L5.45459 9.71245L11.5877 0.774185ZM7.45829 9.26136L11.9999 2.64239L16.5417 9.26139L11.9996 11.7259L7.45829 9.26136Z"
      fill="currentColor"
    />
    <path
      d="M11.999 15.0611L4.84062 11.0826L4.64513 11.3744C2.44037 14.6653 2.93275 18.9752 5.82899 21.7366C9.23714 24.9857 14.7628 24.9857 18.1711 21.7366C21.0673 18.9752 21.5595 14.6653 19.3549 11.3744L19.1592 11.0825L11.9994 15.0614L11.999 15.0611Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLido;
