import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import BorrowTab from 'components/Basic/BorrowTabs/BorrowTab';
import RepayBorrowTab from 'components/Basic/BorrowTabs/RepayBorrowTab';
import { Modal } from 'antd';
import closeImg from 'assets/img/close.png';

const ModalContent = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);

  .close-btn {
    position: absolute;
    top: 30px;
    right: 23px;
  }

  .header-content {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid var(--color-bg-active);

    img {
      height: 30px;
      width: 30px;
      margin-right: 20px;
    }

    .title {
      font-size: 24.5px;
      color: var(--color-text-main);
    }
  }
`;

export const TabSection = styled.div`
  max-width: 450px;
  .body-content {
    height: 135px;
    margin: 30px 0;

    .input-wrapper {
      width: 100%;
      position: relative;

      input {
        width: 65%;
        margin-left: 17.5%;
        border: none;
        height: 100%;
        font-size: 40px;
        color: var(--color-yellow);
        text-align: center;
        background: transparent;
        &:focus {
          outline: none;
        }
      }
      .max {
        position: absolute;
        right: 25px;
        width: 12%;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        color: #bdbdbd;
      }
    }

    img {
      height: 50px;
      width: 50px;
      margin-bottom: 20px;
    }
  }

  .repay-vai-content {
    margin: 0;
  }

  .vai-content-section {
    height: 260px;
  }

  .apy-content {
    width: 100%;
    border-bottom: 1px solid var(--color-bg-active);
    margin-top: 20px;
  }

  .description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: var(--color-text-main);
    width: 100%;
    margin-bottom: 20px;

    &.borrow-caps {
      border-top: 1px solid var(--color-bg-active);
      padding: 10px 0;
      margin: 0;
    }
  }

  .borrow-balance {
    font-size: 16px;
    color: var(--color-text-main);
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  .borrow-limit {
    font-size: 16px;
    color: var(--color-text-main);
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media only screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
    }
  }

  .button {
    margin: 20px 0;
    width: 248px;
    height: 41px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #f2c265, #f7b44f);

    .MuiButton-label {
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-main);
      text-transform: capitalize;
    }

    &.vai-auto {
      margin-top: auto;
    }
  }

  .asset-img {
    height: 30px;
    width: 30px;
    margin-right: 12px;
  }

  .arrow-right-img {
    height: 10px;
    width: 15px;
    margin: 0 10px;
  }

  .warning-label {
    width: 100%
    font-size: 15px;
    color: var(--color-text-secondary);
    padding: 10px 25px;
  }
`;

export const Tabs = styled.div`
  width: 100%;
  padding: 0 20px;
  .tab-item {
    width: 100%;
    height: 41px;
    color: var(--color-text-secondary);
  }
  .tab-active {
    border-radius: 5px;
    font-weight: 600;
    background-color: var(--color-bg-main);
    color: var(--color-text-main);
  }

  .ant-progress-inner {
    background-color: var(--color-bg-primary);
  }
`;

export const TabContent = styled.div`
  width: calc(100% - 40px);
  height: calc(100% - 75px);
  margin: 20px;
  padding: 0 20px;
  border-radius: 20px;
  background-color: var(--color-bg-main);
  .vai-balance {
    display: flex;
    flex-direction: column;
  }
`;

function BorrowModal({ visible, asset, onCancel }) {
  const [currentTab, setCurrentTab] = useState('borrow');

  useEffect(() => {
    setCurrentTab('borrow');
  }, [visible]);

  if (!asset.id) {
    return <></>;
  }
  return (
    <Modal
      className="connect-modal"
      width={450}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        />
        <div className="flex align-center just-center header-content">
          <img src={asset.img} alt="asset" />
          <p className="title">{asset.name}</p>
        </div>
        {currentTab === 'borrow' && (
          <BorrowTab
            asset={asset}
            changeTab={setCurrentTab}
            onCancel={onCancel}
          />
        )}
        {currentTab === 'repayBorrow' && (
          <RepayBorrowTab
            asset={asset}
            changeTab={setCurrentTab}
            onCancel={onCancel}
          />
        )}
      </ModalContent>
    </Modal>
  );
}

BorrowModal.propTypes = {
  visible: PropTypes.bool,
  asset: PropTypes.object,
  onCancel: PropTypes.func
};

BorrowModal.defaultProps = {
  visible: false,
  asset: {},
  onCancel: () => {}
};

export default BorrowModal;
