import styled from 'styled-components';

export const FaucetWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  height: 100%;
  flex: 1;
  padding: 20px;
  input {
    width: 100%;
    height: 42px;
  }

  .header {
    font-size: 36px;
    font-weight: 600;
    color: var(--color-text-main);
    margin-top: 100px;
    margin-bottom: 30px;
    text-align: center;

    @media only screen and (max-width: 768px) {
      font-size: 28px;
      margin-top: 0;
    }
  }

  .bottom {
    color: var(--color-text-main);
    padding: 30px 0;

    .title {
      font-size: 24px;
      font-weight: 600;
    }

    .description {
      margin-top: 10px;
      font-size: 16px;
      font-weight: normal;
      text-align: center;
    }
  }

  .button-section {
    margin: 20px 0;
  }

  .empty-menu {
    opacity: 0;

    @media only screen and (max-width: 768px) {
      display: none;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
  .button {
    width: 150px;
    height: 40px;
    font-size: 15px;
  }
`;
