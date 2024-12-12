import type { SVGProps } from 'react';

const SvgSpaceId = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.01764 10.1264C9.01764 9.61757 9.42777 9.19985 9.94422 9.19985H10.3164C10.8252 9.19985 11.2354 9.60997 11.2354 10.1264V10.4986C11.2354 11.0074 10.8252 11.4252 10.3088 11.4252H9.93663C9.42777 11.4252 9.01764 11.015 9.01764 10.4986V10.1264ZM9.94422 5.88086C9.43536 5.88086 9.02523 6.29099 9.02523 6.80744V7.17959C9.02523 7.68845 9.43536 8.10618 9.95182 8.10618H10.324C10.8328 8.10618 11.243 7.69605 11.243 7.17959V6.80744C11.243 6.29858 10.8328 5.88086 10.3164 5.88086H9.94422Z"
      fill="#AAB3CA"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.69114 2C3.6481 2 2 3.6557 2 5.69114V10.3089C2 12.3519 3.6557 14 5.69114 14H10.3089C12.3519 14 14 12.3443 14 10.3089V5.69114C14 3.6481 12.3443 2 10.3089 2H5.69114ZM10.3089 3.47342H5.69114C4.46835 3.47342 3.47342 4.46835 3.47342 5.69114V10.3089C3.47342 11.5316 4.46835 12.5266 5.69114 12.5266H10.3089C11.5316 12.5266 12.5266 11.5316 12.5266 10.3089V5.69114C12.5266 4.46835 11.5316 3.47342 10.3089 3.47342Z"
      fill="#AAB3CA"
    />
  </svg>
);

export default SvgSpaceId;
