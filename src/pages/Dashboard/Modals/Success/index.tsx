/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { BscLink, Modal, Icon, IModalProps } from 'components';
import { useStyles } from '../styles';

export interface ISuccessModalProps {
  className?: string;
  onClose: IModalProps['handleClose'];
  isOpen: boolean;
  title: string;
  description: string | React.ReactElement;
}

export const SuccessModal: React.FC<ISuccessModalProps> = ({
  className,
  onClose,
  isOpen,
  title,
  description,
}) => {
  const styles = useStyles();
  return (
    <Modal isOpened={isOpen} handleClose={onClose}>
      <>
        <div className={className} css={[styles.container, styles.centerColumn]}>
          <Icon name="success" css={styles.icon} />
          <Typography css={styles.successTitle} component="h4" variant="h4">
            {title}
          </Typography>
          <Typography css={styles.successMessage} variant="small1">
            {description}
          </Typography>
          <BscLink
            css={styles.bscScan}
            hash="0x6b8a5663cd46f7b719391c518c60e2f45427b95a082e3e47739b011faccbfc96"
          />
        </div>
      </>
    </Modal>
  );
};

export default SuccessModal;
