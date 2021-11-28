import styled from 'styled-components';

export const VaultCardWrapper = styled.div`
  width: 100%;
  margin: 16px;
  margin-bottom: 0;
  background-color: #181d38;
  border-radius: 8px;

  .header-container {
    padding: 16px;
    padding-bottom: 4px;
    border-bottom: 1px solid #262b48;
    &.fold {
      border: none;
    }
  }

  .header {
    display: flex;
    flex-wrap: wrap;
  }

  .col-item {
    margin-bottom: 12px;
    text-align: center;
  }

  @media only screen and (min-width: 992px) {
    .col-item {
      text-align: left;
    }
  }

  .title {
    font-size: 14px;
    line-height: 16px;
    color: #a1a1a1;
    margin-bottom: 4px;
  }

  .content {
    color: #fff;
    font-size: 14px;
    line-height: 16px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
  .expand-icon-wrapper {
    text-align: center;
    cursor: pointer;
  }
  .expand-icon {
    width: 14px;
    height: 8px;
    margin-top: 15px;
    margin-left: 8px;
  }
`;

export const CardItemWrapper = styled.div`
  .card-title {
    display: flex;
    margin-bottom: 12px;
    justify-content: space-between;
    align-items: center;
    .icon {
      color: #aaa;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
  }

  .card-item {
    position: relative;
    background: #090e25;
    border-radius: 8px;
    height: 165px;
    margin-left: 16px;
    margin-bottom: 16px;
    padding: 16px;
  }

  .button {
    position: absolute;
    width: calc(100% - 32px);
    color: #fff;
    bottom: 16px;
    left: 16px;
    right: 16px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    line-height: 36px;
    background: #ebbf6e;
    text-align: center;
    cursor: pointer;
  }

  button:disabled {
    background: #d3d3d3;
    cursor: not-allowed;
  }

  .input-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    input {
      width: 80%;
      height: 31px;
      border: none;
      font-size: 24px;
      line-height: 31px;
      background: transparent;
      &:focus {
        outline: none;
      }
    }
    .max {
      font-size: 14px;
      line-height: 16px;
      color: #ebbf6e;
    }
  }

  .center-amount {
    text-align: center;
    margin-top: 24px;
  }
`;
