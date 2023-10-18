/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { PrimaryButton, TokenIcon } from 'components';
import { ContractReceipt } from 'ethers';
import { useGetToken } from 'packages/tokens';
import { useContext } from 'react';
import * as React from 'react';
import { useTranslation } from 'translation';

import { ConnectWallet } from 'containers/ConnectWallet';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';

export interface WithdrawProps {
  xvsWithdrawableAmount: BigNumber | undefined;
  withdrawXvs: () => Promise<ContractReceipt>;
  withdrawXvsLoading: boolean;
}

const Withdraw: React.FC<WithdrawProps> = ({
  xvsWithdrawableAmount,
  withdrawXvs,
  withdrawXvsLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const readableXvsAvailable = useConvertWeiToReadableTokenString({
    valueWei: xvsWithdrawableAmount,
    token: xvs,
  });

  const handleTransactionMutation = useHandleTransactionMutation();

  const onSubmit = () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return handleTransactionMutation({
      mutate: withdrawXvs,
      successTransactionModalProps: contractReceipt => ({
        title: t('convertVrt.successfulConvertTransactionModal.title'),
        transactionHash: contractReceipt.transactionHash,
        content: (
          <div css={styles.successModalConversionAmounts}>
            {xvs && <TokenIcon token={xvs} css={styles.successModalToken} />}
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {readableXvsAvailable}
            </Typography>
          </div>
        ),
      }),
    });
  };

  return (
    <div css={styles.root}>
      <ConnectWallet message={t('convertVrt.connectWalletToWithdrawXvs')}>
        <section css={styles.title}>
          <Typography variant="h3">{readableXvsAvailable}</Typography>
          <Typography variant="small2">{t('convertVrt.withdrawableAmount')}</Typography>
        </section>
        <PrimaryButton
          disabled={
            !xvsWithdrawableAmount ||
            xvsWithdrawableAmount.isZero() ||
            xvsWithdrawableAmount.isNaN()
          }
          className="w-full"
          onClick={onSubmit}
          loading={withdrawXvsLoading}
        >
          {t('convertVrt.withdrawXvs')}
        </PrimaryButton>
      </ConnectWallet>
    </div>
  );
};

export default Withdraw;
