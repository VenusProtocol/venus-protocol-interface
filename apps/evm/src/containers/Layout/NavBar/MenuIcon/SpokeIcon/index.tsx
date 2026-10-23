import { useId } from 'react';

export const SpokeIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => {
  const idPrefix = useId();
  const gradientIds = Array.from({ length: 9 }, (_, index) => `${idPrefix}-${index}`);

  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="48" height="48" rx="8" fill={`url(#${gradientIds[0]})`} />
      <rect
        x="36.385"
        y="20.7014"
        width="6.30145"
        height="13.7998"
        transform="rotate(90 36.385 20.7014)"
        fill={`url(#${gradientIds[1]})`}
      />
      <rect
        x="11.4543"
        y="26.9977"
        width="6.28643"
        height="15.1916"
        transform="rotate(-90 11.4543 26.9977)"
        fill={`url(#${gradientIds[2]})`}
      />
      <circle
        cx="32.7827"
        cy="15.217"
        r="3.15787"
        transform="rotate(45 32.7827 15.217)"
        fill="#D9D9D9"
      />
      <circle cx="24" cy="24.2232" r="3.15787" transform="rotate(45 24 24.2232)" fill="#D9D9D9" />
      <circle
        cx="14.9192"
        cy="14.9193"
        r="3.15787"
        transform="rotate(45 14.9192 14.9193)"
        fill="#D9D9D9"
      />
      <circle
        cx="33.0808"
        cy="33.0808"
        r="3.15787"
        transform="rotate(45 33.0808 33.0808)"
        fill="#D9D9D9"
      />
      <circle data-nav-part="spoke-right" cx="36.3555" cy="23.851" r="3.15787" fill="#D9D9D9" />
      <circle data-nav-part="spoke-left" cx="11.1907" cy="23.8547" r="3.15787" fill="#D9D9D9" />
      <rect
        x="26.9246"
        y="36.4646"
        width="6.30145"
        height="13.7998"
        transform="rotate(-180 26.9246 36.4646)"
        fill={`url(#${gradientIds[3]})`}
      />
      <rect
        x="20.6284"
        y="11.5341"
        width="6.28643"
        height="15.1916"
        fill={`url(#${gradientIds[4]})`}
      />
      <rect
        x="36.385"
        y="20.7014"
        width="6.30145"
        height="13.7998"
        transform="rotate(90 36.385 20.7014)"
        fill={`url(#${gradientIds[5]})`}
      />
      <rect
        x="11.4543"
        y="26.9977"
        width="6.28643"
        height="15.1916"
        transform="rotate(-90 11.4543 26.9977)"
        fill={`url(#${gradientIds[6]})`}
      />
      <rect
        x="26.9246"
        y="36.4646"
        width="6.30145"
        height="13.7998"
        transform="rotate(-180 26.9246 36.4646)"
        fill={`url(#${gradientIds[7]})`}
      />
      <rect
        x="20.6284"
        y="11.5341"
        width="6.28643"
        height="15.1916"
        fill={`url(#${gradientIds[8]})`}
      />
      <circle data-nav-part="spoke-down" cx="23.7751" cy="36.4352" r="3.15787" fill="#D9D9D9" />
      <circle data-nav-part="spoke-up" cx="23.7714" cy="11.2704" r="3.15787" fill="#D9D9D9" />
      <circle
        cx="15.2168"
        cy="32.7829"
        r="3.15787"
        transform="rotate(45 15.2168 32.7829)"
        fill="#D9D9D9"
      />

      <defs>
        <radialGradient
          id={gradientIds[0]}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(4.90909 3.27272) rotate(47.3859) scale(55.5882)"
        >
          <stop stopColor="#4C555F" />
          <stop offset="0.430533" stopColor="#2D353E" />
          <stop offset="1" stopColor="#0F171F" />
        </radialGradient>
        <linearGradient
          id={gradientIds[1]}
          x1="39.6698"
          y1="21.5088"
          x2="39.5462"
          y2="29.0793"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={gradientIds[2]}
          x1="14.7313"
          y1="27.8865"
          x2="14.5812"
          y2="36.22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={gradientIds[3]}
          x1="30.2093"
          y1="37.272"
          x2="30.0858"
          y2="44.8425"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={gradientIds[4]}
          x1="23.9053"
          y1="12.4229"
          x2="23.7553"
          y2="20.7564"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={gradientIds[5]}
          x1="39.6698"
          y1="21.5088"
          x2="39.5462"
          y2="29.0793"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={gradientIds[6]}
          x1="14.7313"
          y1="27.8865"
          x2="14.5812"
          y2="36.22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={gradientIds[7]}
          x1="30.2093"
          y1="37.272"
          x2="30.0858"
          y2="44.8425"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={gradientIds[8]}
          x1="23.9053"
          y1="12.4229"
          x2="23.7553"
          y2="20.7564"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D9D9D9" stopOpacity="0.5" />
          <stop offset="1" stopColor="#737373" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
