import styled from 'styled-components';

export const Card = styled.div`
  height: 100%;
  display: flex;
  border-radius: 24px;
  margin: 8px;
  padding: 0px;
  flex-direction: ${({ direction }) => direction};
  justify-content: center;
`;
