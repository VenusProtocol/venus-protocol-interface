/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, TabContent, Tabs, TokenIconWithSymbol } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { VToken } from 'types';
import { isTokenEnabled } from 'utilities';

import SupplyModal from './Supply';
import WithdrawModal from './Withdraw';

export interface SupplyWithdrawProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
  poolComptrollerAddress: string;
}

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const SupplyWithdrawModal: React.FC<SupplyWithdrawProps> = ({
  vToken,
  onClose,
  poolComptrollerAddress,
}) => {
  const { t } = useTranslation();

  const tabsContent: TabContent[] = [
    {
      title: t('supplyWithdraw.withdrawTabTitle'),
      content: (
        <WithdrawModal
          onClose={onClose}
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
        />
      ),
    },
  ];

  // Prevent user from being able to supply UST or LUNA
  if (isTokenEnabled(vToken.underlyingToken)) {
    tabsContent.unshift({
      title: t('supplyWithdraw.supplyTabTitle'),
      content: (
        <SupplyModal
          onClose={onClose}
          vToken={vToken}
          poolComptrollerAddress={poolComptrollerAddress}
        />
      ),
    });
  }

  return (
    <Modal
      isOpen
      handleClose={onClose}
      title={<TokenIconWithSymbol token={vToken.underlyingToken} variant="h4" />}
    >
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default SupplyWithdrawModal;
