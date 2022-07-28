/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { Modal, ModalProps } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import { useStyles } from './styles';

export interface LunaUstWarningModalProps {
  onClose: ModalProps['handleClose'];
}

const LunaUstWarningModal: React.FC<LunaUstWarningModalProps> = ({ onClose }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Modal isOpen title={t('dashboard.lunaUstWarningModal.title')} handleClose={onClose}>
      <Typography css={styles.text}>{t('dashboard.lunaUstWarningModal.content')}</Typography>
    </Modal>
  );
};

export default LunaUstWarningModal;
