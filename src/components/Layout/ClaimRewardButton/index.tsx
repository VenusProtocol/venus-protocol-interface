/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { formatCentsToReadableValue } from 'utilities';

import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';

import { ButtonProps, PrimaryButton } from '../../Button';
import { Modal } from '../../Modal';
import TEST_IDS from '../testIds';

export interface ClaimRewardButtonUiProps extends ClaimRewardButtonProps {
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  amountCents?: number;
}

export const ClaimRewardButtonUi: React.FC<ClaimRewardButtonUiProps> = ({
  isModalOpen,
  onOpenModal,
  onCloseModal,
  amountCents,
  ...otherButtonProps
}) => {
  const { t } = useTranslation();

  const readableAmountDollars = useMemo(
    () =>
      formatCentsToReadableValue({
        value: amountCents,
        shortenLargeValue: true,
      }),
    [amountCents],
  );

  if (!amountCents) {
    return null;
  }

  return (
    <>
      <PrimaryButton
        data-testid={TEST_IDS.claimRewardButton}
        onClick={onOpenModal}
        {...otherButtonProps}
      >
        {t('claimRewardButton.button.title', { amount: readableAmountDollars })}
      </PrimaryButton>

      <Modal
        isOpen={isModalOpen}
        handleClose={onCloseModal}
        title={<h4>{t('claimRewardButton.modal.title')}</h4>}
      >
        <></>
      </Modal>
    </>
  );
};

export type ClaimRewardButtonProps = Omit<ButtonProps, 'onClick'>;

export const ClaimRewardButton: React.FC<ClaimRewardButtonProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  // TODO: fetch pending reward sum in dollars
  const amountCents = 19961;
  const isGetRewardAmountLoading = false;

  const handleOpenModal = async () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <ClaimRewardButtonUi
      amountCents={amountCents}
      loading={isGetRewardAmountLoading}
      isModalOpen={isModalOpen}
      onOpenModal={handleOpenModal}
      onCloseModal={handleCloseModal}
      {...props}
    />
  );
};

export default ClaimRewardButton;
