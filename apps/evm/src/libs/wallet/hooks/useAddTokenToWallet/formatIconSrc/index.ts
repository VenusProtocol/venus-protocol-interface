const ABSOLUTE_URL_REGEX = /^[a-z][a-z0-9+.-]*:/i;

export const formatIconSrc = ({ iconSrc }: { iconSrc: string }) =>
  ABSOLUTE_URL_REGEX.test(iconSrc) ? iconSrc : `${window.location.origin}${iconSrc}`;
