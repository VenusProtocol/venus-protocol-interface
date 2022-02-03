import styled from 'styled-components';

export const Label = styled.span`
  font-size: ${({ size }) => size || 16}px;
  font-weight: 900;
  color: ${({ primary }) =>
    primary ? 'var(--color-text-main)' : 'var(--color-text-secondary)'};
`;
