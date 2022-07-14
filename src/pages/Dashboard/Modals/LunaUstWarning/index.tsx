/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { IModalProps, Modal } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import { useStyles } from './styles';

export interface ILunaUstWarningModalProps {
  onClose: IModalProps['handleClose'];
}

const LunaUstWarningModal: React.FC<ILunaUstWarningModalProps> = ({ onClose }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Modal isOpen title={t('dashboard.lunaUstWarningModal.title')} handleClose={onClose}>
      <Typography css={styles.text}>{t('dashboard.lunaUstWarningModal.content')}</Typography>
    </Modal>
  );
};

export default LunaUstWarningModal;
