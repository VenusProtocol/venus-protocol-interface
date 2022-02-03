import styled from 'styled-components';

export const Row = styled.div`
  width: 100%;
  &::after {
    content: '';
    clear: both;
    display: table;
  }
`;

function getWidthString(span) {
  if (!span) return '';

  const width = (span / 12) * 100;
  return `width: ${width}%;`;
}

export const Column = styled.div`
  float: left;
  ${({ xs }) => (xs ? getWidthString(xs) : 'width: 100%')};

  @media only screen and (min-width: 768px) {
    ${({ sm }) => sm && getWidthString(sm)};
  }

  @media only screen and (min-width: 992px) {
    ${({ md }) => md && getWidthString(md)};
  }

  @media only screen and (min-width: 1200px) {
    ${({ lg }) => lg && getWidthString(lg)};
  }
`;
