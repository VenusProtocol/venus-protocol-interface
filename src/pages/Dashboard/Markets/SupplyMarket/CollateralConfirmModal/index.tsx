/** @jsxImportSource @emotion/react */
import React from 'react';
import { Icon, Modal, IModalProps } from 'components';
import { Asset } from 'types';
import { ReactComponent as LogoWithText } from 'assets/img/v2/venusLogoWithText.svg';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'translation';
import { useStyles } from './styles';

export interface IConfirmCollateralModalProps {
  asset: Asset | undefined;
  handleClose: IModalProps['handleClose'];
}
// @TODO: Match designs when they are complete
export const CollateralConfirmModal: React.FC<IConfirmCollateralModalProps> = ({
  asset,
  handleClose,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const title = asset?.collateral
    ? t('markets.collateralConfirmModal.disable')
    : t('markets.collateralConfirmModal.enable');

  return (
    <Modal className="venus-modal" isOpened={!!asset} handleClose={handleClose} title={title}>
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
