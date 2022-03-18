import React from 'react';
import styled from 'styled-components';
import { Modal, Spin, Icon } from 'antd';
import closeImg from 'assets/img/close.png';
import { ReactComponent as VenusLogo } from 'assets/img/v2/venusLogoWithText.svg';

const ModalContent = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);

  .close-btn {
    position: absolute;
    top: 23px;
    right: 23px;
  }

  .logo {
    width: 110px;
    margin-top: 84px;
    margin-bottom: 48px;
  }
  .title {
    font-size: 24.5px;
    color: var(--color-text-main);
  }

  .voting-spinner {
    color: var(--color-yellow);
    margin-top: 54px;
    margin-bottom: 40px;
  }

  .confirm-text {
    font-size: 21px;
    color: var(--color-text-secondary);
    margin-bottom: 104px;
  }
`;

const antIcon = <Icon type="loading" style={{ fontSize: 64 }} spin />;

interface CollateralConfirmModalProps {
  visible: boolean;
  isCollateralEnalbe?: boolean;
  onCancel: () => void;
}

function CollateralConfirmModal({
  visible,
  isCollateralEnalbe,
  onCancel,
}: CollateralConfirmModalProps) {
  return (
    <Modal
      className="collateral-confirm-modal"
      width={532}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img className="close-btn pointer" src={closeImg} alt="close" onClick={onCancel} />
        <VenusLogo className="logo" />
        <p className="title">{`${isCollateralEnalbe ? 'Disable' : 'Enable'} as collateral`}</p>
        <Spin className="voting-spinner" indicator={antIcon} />
        <p className="confirm-text">Confirm the transaction</p>
      </ModalContent>
    </Modal>
  );
}

export default CollateralConfirmModal;
