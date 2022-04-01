import styled from 'styled-components';

export const ConvertWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;

  /* override antd progress bar styles cuz "trailColor" doesn't work... */
  .ant-progress-inner {
    background-color: var(--color-bg-main);
  }

  .ratio-text {
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    margin-bottom: 16px;
    .span {
      display: inline-block;
      margin: 0 4px;
    }
  }

  .info-banner {
    text-align: center;
    margin-bottom: 32px;
    color: var(--color-text-secondary);
  }

  /* xvs pool */
  .xvs-pool {
    text-align: center;
    &-line-1 {
      font-size: 24px;
      line-height: 28px;
      margin-bottom: 8px;
    }
    &-line-2 {
      font-size: 12px;
      line-height: 14px;
      color: #a1a1a1;
      margin-bottom: 32px;
    }
  }

  /* convert section */
  .convert-daily-progress {
    margin-bottom: 32px;
    .convert-daily-progress-title {
      font-size: 14px;
      line-height: 21px;
      display: flex;
      justify-content: space-between;
    }
  }

  .convert-vrt {
    margin-bottom: 32px;
  }

  /* inputs */
  .input-title {
    font-size: 12px;
    line-height: 14px;
    color: #fff;
    margin-bottom: 6px;
  }

  .input-wrapper {
    background-color: var(--color-bg-active);
    border-radius: 8px;
    display: flex;
    height: 40px;
    align-items: center;
    padding: 8px 12px;
    .input {
      flex: 1;
      border: none;
      background-color: transparent;
      &:focus {
        outline: none;
      }
    }
    .max-button {
      width: 39px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
    }
    img {
      width: 16px;
      height: 16px;
      display: inline-block;
      margin-right: 8px;
    }
  }

  .user-vrt-balance {
    font-size: 12px;
    line-height: 14px;
    color: #757575;
    margin-top: 4px;
  }

  /* xvs recieved */
  .recieve-xvs-symbol {
    font-size: 12px;
    line-height: 14px;
  }

  .recieve-xvs {
    margin-bottom: 24px;
    &,
    .recieve-xvs-input {
      cursor: not-allowed;
    }
  }

  /* remaining days */
  .remaining-days {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 16px;
  }

  .clock-icon {
    display: inline-block;
    margin-right: 4px;
    width: 16px;
    height: 16px;
    color: var(--color-gold);
  }

  .remaining-cap-text {
    font-size: 14px;
    line-height: 21px;
    color: #a1a1a1;
    display: inline-block;
    margin-right: 4px;
  }

  .remaining-time-text {
    font-size: 14px;
    line-height: 21px;
    color: #fff;
  }
`;
