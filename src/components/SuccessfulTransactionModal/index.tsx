/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';
import React from 'react';
import { Token } from 'types';
import { convertWeiToTokens } from 'utilities';

import { useAuth } from 'context/AuthContext';

import { BscLink } from '../BscLink';
import { Icon } from '../Icon';
import { Modal, ModalProps } from '../Modal';
import { TokenIcon } from '../TokenIcon';
import { useStyles } from './styles';

export interface SuccessfulTransactionModalProps extends Omit<ModalProps, 'children'> {
  title: string;
  content?: string | React.ReactElement;
  transactionHash: string;
  amount?: {
    token: Token;
    valueWei: BigNumber;
  };
  className?: string;
}

export const SuccessfulTransactionModal: React.FC<SuccessfulTransactionModalProps> = ({
  className,
  title,
  content,
  amount,
  transactionHash,
  isOpen,
  handleClose,
}) => {
  const { chainId } = useAuth();
  const styles = useStyles();

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className={className} css={styles.container}>
        <Icon name="check" css={styles.headerIcon} />

        <h3 css={styles.title}>{title}</h3>

        <div css={styles.messageContainer}>
          {!!content && (
            <Typography variant="small1" component="p">
              {content}
            </Typography>
          )}
          {amount && (
            <div css={styles.amountContainer}>
              <TokenIcon token={amount.token} css={styles.amountTokenIcon} />

              <Typography variant="small1" component="span">
                {convertWeiToTokens({
                  valueWei: amount.valueWei,
                  token: amount.token,
                  returnInReadableFormat: true,
                })}
              </Typography>
            </div>
          )}
        </div>

        <BscLink hash={transactionHash} urlType="tx" chainId={chainId} />
      </div>
    </Modal>
  );
};
