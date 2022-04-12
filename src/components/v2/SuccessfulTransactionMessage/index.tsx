/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';

import { convertWeiToCoins } from 'utilities/common';
import { TokenSymbol } from 'types';
import { BscLink } from '../BscLink';
import { Icon, IconName } from '../Icon';
import { IModalProps, Modal } from '../Modal';
import { useStyles } from './styles';

export interface ISuccessfulTransactionMessageProps {
  title: string;
  message: string;
  transactionHash: string;
  amount?: {
    tokenSymbol: TokenSymbol;
    valueWei: BigNumber;
  };
  className?: string;
}

export const SuccessfulTransactionMessage: React.FC<ISuccessfulTransactionMessageProps> = ({
  className,
  title,
  message,
  amount,
  transactionHash,
}) => {
  const styles = useStyles();

  return (
    <div className={className} css={styles.container}>
      <Icon name="check" css={styles.headerIcon} />

      <h3 css={styles.title}>{title}</h3>

      <div css={styles.messageContainer}>
        <Typography variant="small1" component="p">
          {message}
        </Typography>

        {amount && (
          <div css={styles.amountContainer}>
            <Icon name={amount.tokenSymbol as IconName} css={styles.amountTokenIcon} />

            <Typography variant="small1" component="span">
              {convertWeiToCoins({
                value: amount.valueWei,
                tokenSymbol: amount.tokenSymbol,
                returnInReadableFormat: true,
              })}
            </Typography>
          </div>
        )}
      </div>

      <BscLink hash={transactionHash} />
    </div>
  );
};

export type SuccessfulTransactionModalProps = Omit<IModalProps, 'children'> &
  ISuccessfulTransactionMessageProps;

export const SuccessfulTransactionModal: React.FC<SuccessfulTransactionModalProps> = ({
  className,
  title,
  message,
  amount,
  transactionHash,
  isOpened,
  handleClose,
}) => (
  <Modal isOpened={isOpened} handleClose={handleClose}>
    <SuccessfulTransactionMessage
      className={className}
      title={title}
      message={message}
      transactionHash={transactionHash}
      amount={amount}
    />
  </Modal>
);
