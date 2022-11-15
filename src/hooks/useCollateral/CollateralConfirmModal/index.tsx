/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { Icon, Modal, ModalProps } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { ReactComponent as LogoWithText } from 'assets/img/venusLogoWithText.svg';

import { useStyles } from './styles';

export interface ConfirmCollateralModalProps {
  asset: Asset | undefined;
  handleClose: ModalProps['handleClose'];
}

export const CollateralConfirmModal: React.FC<ConfirmCollateralModalProps> = ({
  asset,
  handleClose,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const title = asset?.collateral
    ? t('markets.collateralConfirmModal.disable', { asset: asset?.token.symbol })
    : t('markets.collateralConfirmModal.enable', { asset: asset?.token.symbol });

  return (
    <Modal className="venus-modal" isOpen={!!asset} handleClose={handleClose} title={title}>
      <section css={styles.collateralModalContainer}>
        <LogoWithText className="logo" />

        <Icon className="voting-spinner" name="loading" size="28px" css={styles.loadingIcon} />

        <Typography component="p" variant="body2">
          {t('markets.collateralConfirmModal.confirmText')}
        </Typography>
      </section>
    </Modal>
  );
};
