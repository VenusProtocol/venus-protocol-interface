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

function getWidthString(span: $TSFixMe) {
  if (!span) return '';

  const width = (span / 12) * 100;
  return `width: ${width}%;`;
}

export const Column = styled.div`
  float: left;
  ${({ xs }: $TSFixMe) => (xs ? getWidthString(xs) : 'width: 100%')};

  @media only screen and (min-width: 768px) {
    ${({ sm }: $TSFixMe) => sm && getWidthString(sm)};
  }

  @media only screen and (min-width: 992px) {
    ${({ md }: $TSFixMe) => md && getWidthString(md)};
  }

  @media only screen and (min-width: 1200px) {
    ${({ lg }: $TSFixMe) => lg && getWidthString(lg)};
  }
`;
