import styled from 'styled-components';

interface Props {
  size?: number | string;
  primary?: boolean;
}

export const Label = styled.span`
  font-size: ${({ size }: Props) => size || 16}px;
  font-weight: 900;

  color: ${({ primary }: Props) =>
    primary ? 'var(--color-text-main)' : 'var(--color-text-secondary)'};
`;
