/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';

import { ChainExplorerLink } from 'containers/ChainExplorerLink';
import { useChainId } from 'libs/wallet';
import { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { Icon } from '../Icon';
import { Modal, ModalProps } from '../Modal';
import { TokenIcon } from '../TokenIcon';
import { useStyles } from './styles';

export interface SuccessfulTransactionModalProps extends Omit<ModalProps, 'children' | 'content'> {
  title: string;
  content?: string | React.ReactElement;
  transactionHash: string;
  amount?: {
    token: Token;
    value: BigNumber;
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
  const { chainId } = useChainId();
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
                {convertMantissaToTokens({
                  value: amount.value,
                  token: amount.token,
                  returnInReadableFormat: true,
                })}
              </Typography>
            </div>
          )}
        </div>

        <ChainExplorerLink hash={transactionHash} urlType="tx" chainId={chainId} />
      </div>
    </Modal>
  );
};
