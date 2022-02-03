// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
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
    margin-left: 16px;
    margin-bottom: 16px;
    padding: 16px;
    min-height: 165px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .button {
    width: 100%;
    color: #fff;
    border-radius: 8px;
    border: none;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 36px;
    background: var(--color-gold);
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
      color: var(--color-gold);
    }
  }

  .center-amount {
    text-align: center;
    margin-top: 24px;
  }
`;
