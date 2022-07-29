/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'translation';

import { Button } from '../Button';
import { Icon } from '../Icon';
import { Modal, ModalProps } from '../Modal';
import { useStyles } from './styles';

export interface LunaUstWarningModalProps {
  onClose: ModalProps['handleClose'];
}

export const LunaUstWarningModal: React.FC<LunaUstWarningModalProps> = ({ onClose }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Modal isOpen handleClose={onClose}>
      <>
        <Icon name="attention" css={styles.icon} />

        <Typography css={styles.title} variant="h3">
          {t('lunaUstWarningModal.title')}
        </Typography>

        <Typography css={styles.message}>{t('lunaUstWarningModal.content')}</Typography>

        <Button onClick={onClose} variant="secondary" fullWidth>
          {t('lunaUstWarningModal.closeButtonLabel')}
        </Button>
      </>
    </Modal>
  );
};
