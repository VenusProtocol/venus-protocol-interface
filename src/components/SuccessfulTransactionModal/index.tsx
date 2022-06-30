/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';

import { convertWeiToTokens } from 'utilities';
import { TokenId } from 'types';
import { BscLink } from '../BscLink';
import { Icon, IconName } from '../Icon';
import { IModalProps, Modal } from '../Modal';
import { useStyles } from './styles';

export interface ISuccessfulTransactionModalProps extends Omit<IModalProps, 'children'> {
  title: string;
  content?: string | React.ReactElement;
  transactionHash: string;
  amount?: {
    tokenId: TokenId;
    valueWei: BigNumber;
  };
  className?: string;
}

export const SuccessfulTransactionModal: React.FC<ISuccessfulTransactionModalProps> = ({
  className,
  title,
  content,
  amount,
  transactionHash,
  isOpen,
  handleClose,
}) => {
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
              <Icon name={amount.tokenId as IconName} css={styles.amountTokenIcon} />

              <Typography variant="small1" component="span">
                {convertWeiToTokens({
                  valueWei: amount.valueWei,
                  tokenId: amount.tokenId,
                  returnInReadableFormat: true,
                })}
              </Typography>
            </div>
          )}
        </div>

        <BscLink hash={transactionHash} urlType="tx" />
      </div>
    </Modal>
  );
};
