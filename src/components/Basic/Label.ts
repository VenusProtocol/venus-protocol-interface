// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';

export const Label = styled.span`
  font-size: ${({ size }: any) => size || 16}px;
  font-weight: 900;

  color: ${({ primary }: any) => (primary ? 'var(--color-text-main)' : 'var(--color-text-secondary)')};
`;
