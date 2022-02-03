// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';

export const Label = styled.span`
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  font-size: ${({ size }: any) => size || 16}px;
  font-weight: 900;
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  color: ${({ primary }: any) =>
    primary ? 'var(--color-text-main)' : 'var(--color-text-secondary)'};
`;
