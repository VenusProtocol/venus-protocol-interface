// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';

export const Row = styled.div`
  width: 100%;
  &::after {
    content: '';
    clear: both;
    display: table;
  }
`;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
function getWidthString(span: $TSFixMe) {
  if (!span) return '';

  const width = (span / 12) * 100;
  return `width: ${width}%;`;
}

export const Column = styled.div`
  float: left;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  ${({ xs }: $TSFixMe) => (xs ? getWidthString(xs) : 'width: 100%')};

  @media only screen and (min-width: 768px) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
    ${({ sm }: $TSFixMe) => sm && getWidthString(sm)};
  }

  @media only screen and (min-width: 992px) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
    ${({ md }: $TSFixMe) => md && getWidthString(md)};
  }

  @media only screen and (min-width: 1200px) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
    ${({ lg }: $TSFixMe) => lg && getWidthString(lg)};
  }
`;
