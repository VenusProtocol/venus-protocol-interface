import styled from 'styled-components';

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
    bottom: 16px;
    left: 16px;
    right: 16px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 36px;
    background: #ebbf6e;
    text-align: center;
    cursor: pointer;

    &.disabled {
      background: #d3d3d3;
      cursor: not-allowed;
    }
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
