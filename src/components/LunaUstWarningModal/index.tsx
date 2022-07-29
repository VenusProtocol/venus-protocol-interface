/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'translation';

import { Icon } from '../Icon';
import { Modal, ModalProps } from '../Modal';
import { Toggle } from '../Toggle';
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

        <div>
          <div css={styles.toggleItem}>
            {/* TODO: wire up */}
            <Toggle css={styles.toggle} value={true} onChange={() => {}} />

            <Typography color="text.primary" variant="small1" component="span">
              {t('lunaUstWarningModal.lunaToggleLabel')}
            </Typography>
          </div>

          <div css={styles.toggleItem}>
            {/* TODO: wire up */}
            <Toggle css={styles.toggle} value={true} onChange={() => {}} />

            <Typography color="text.primary" variant="small1" component="span">
              {t('lunaUstWarningModal.ustToggleLabel')}
            </Typography>
          </div>
        </div>
      </>
    </Modal>
  );
};
