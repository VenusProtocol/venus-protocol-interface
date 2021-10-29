import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { getTokenContract, methods } from 'utilities/ContractService';
import greenCheckImg from 'assets/img/green-check.png';
import arrowRightImg from 'assets/img/arrow-right.png';
import closeImg from 'assets/img/close.png';
import DelegationVoting from './DelegationVoting';
import ManualVoting from './ManualVoting';

const ModalContent = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);
  padding: 30px 30px 0;

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .go-back {
    position: absolute;
    top: 23px;
    left: 23px;
    transform: rotate(180deg);
  }

  .header-content {
    font-size: 24.5px;
    font-weight: normal;
    color: var(--color-text-main);
    margin-bottom: 38px;
  }

  .check-image {
    width: 28px;
    margin-right: 15px;
  }

  .arrow-image {
    width: 26px;
    height: 16px;
  }

  .section {
    width: 100%;
    cursor: pointer;
    border-top: 1px solid var(--color-bg-active);
    padding: 43px 0;

    span {
      color: var(--color-text-main);
      font-weight: 500;
      font-size: 17px;
    }

    .description {
      font-size: 13.5px;
      font-weight: normal;
      color: var(--color-text-secondary);
      padding: 12px 26px 0 42px;
    }
    .active-delegate {
      color: var(--color-dark-green);
    }
  }

  .hidden {
    display: none;
  }
`;

function DelegationTypeModal({
  address,
  balance,
  delegateStatus,
  visible,
  onCancel
}) {
  const [child, setChild] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVoting = dAddress => {
    setIsLoading(true);
    const tokenContract = getTokenContract('xvs');
    methods
      .send(tokenContract.methods.delegate, [dAddress || address], address)
      .then(() => {
        setIsLoading(false);
        onCancel();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      className="connect-modal"
      width={400}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
      afterClose={() => setChild('')}
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img
          className={`go-back pointer ${child ? '' : 'hidden'}`}
          src={arrowRightImg}
          alt="left arrow"
          onClick={() => setChild('')}
        />
        <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        />
        <div className={`${child ? 'hidden' : ''}`}>
          <div className="flex align-center just-center header-content">
            <p>Choose Delegation Type</p>
          </div>
          <div
            className="flex flex-column section"
            onClick={e => {
              if (delegateStatus === 'self') {
                e.preventDefault();
                return;
              }
              setChild('manual');
              handleVoting('');
            }}
          >
            <div className="flex align-center just-between">
              <div className="flex align-center">
                <img src={greenCheckImg} alt="check" className="check-image" />
                <span>Manual Voting</span>
              </div>
              {delegateStatus !== 'self' ? (
                <img src={arrowRightImg} alt="arrow" className="arrow-image" />
              ) : (
                <p className="active-delegate">Active</p>
              )}
            </div>
            <div className="description">
              This option allows you to vote on proposals directly from your
              connected wallet.
            </div>
          </div>
          <div
            className="flex flex-column section"
            onClick={() => {
              setChild('delegate');
            }}
          >
            <div className="flex align-center just-between">
              <div className="flex align-center">
                <img src={greenCheckImg} alt="check" className="check-image" />
                <span>Delegate Voting</span>
              </div>
              {delegateStatus !== 'delegate' ? (
                <img src={arrowRightImg} alt="arrow" className="arrow-image" />
              ) : (
                <p className="active-delegate">Active</p>
              )}
            </div>
            <div className="description">
              This option allows you to delegate your votes to another Ethereum
              address. You never send Venus, only your voting rights, and can
              undelegate at any time.
            </div>
          </div>
        </div>
        {child === 'delegate' && (
          <DelegationVoting isLoading={isLoading} onDelegate={handleVoting} />
        )}
        {child === 'manual' && (
          <ManualVoting
            isLoading={isLoading}
            balance={balance}
            address={address}
          />
        )}
      </ModalContent>
    </Modal>
  );
}

DelegationTypeModal.propTypes = {
  address: PropTypes.string,
  balance: PropTypes.string,
  visible: PropTypes.bool,
  delegateStatus: PropTypes.string,
  onCancel: PropTypes.func
};

DelegationTypeModal.defaultProps = {
  address: '',
  balance: PropTypes.string,
  visible: false,
  delegateStatus: '',
  onCancel: () => {}
};

export default DelegationTypeModal;
