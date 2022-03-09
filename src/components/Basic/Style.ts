import styled from 'styled-components';

export const Row = styled.div`
  width: 100%;
  &::after {
    content: '';
    clear: both;
    display: table;
  }
`;

function getWidthString(span: string) {
  if (!span) return '';

  const width = (Number(span) / 12) * 100;
  return `width: ${width}%;`;
}

interface Props {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
}

export const Column = styled.div`
  float: left;
  ${({ xs }: Props) => (xs ? getWidthString(xs) : 'width: 100%')};

  @media only screen and (min-width: 768px) {
    ${({ sm }: Props) => sm && getWidthString(sm)};
  }

  @media only screen and (min-width: 992px) {
    ${({ md }: Props) => md && getWidthString(md)};
  }

  @media only screen and (min-width: 1200px) {
    ${({ lg }: Props) => lg && getWidthString(lg)};
  }
`;
