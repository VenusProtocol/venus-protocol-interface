/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';

import { ReactComponent as LogoWithText } from 'assets/img/venusLogoWithText.svg';
import { Icon, Modal, ModalProps } from 'components';
import { useTranslation } from 'libs/translations';
import { Asset } from 'types';

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
  const title = asset?.isCollateralOfUser
    ? t('markets.collateralConfirmModal.disable', { asset: asset?.vToken.underlyingToken.symbol })
    : t('markets.collateralConfirmModal.enable', { asset: asset?.vToken.underlyingToken.symbol });

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
