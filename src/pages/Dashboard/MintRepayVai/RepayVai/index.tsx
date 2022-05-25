/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { TokenId } from 'types';
import { convertCoinsToWei, convertWeiToCoins } from 'utilities/common';
import { InternalError } from 'utilities/errors';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { SecondaryButton, LabeledInlineContent, TokenTextField } from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useRepayVai } from 'clients/api';
import toast from 'components/Basic/Toast';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from '../useConvertToReadableCoinString';
import { VAI_ID } from '../constants';
import { useStyles } from '../styles';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  repayVai: (amountWei: BigNumber) => Promise<TransactionReceipt>;
  userBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
}

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  userMintedWei,
  isRepayVaiLoading,
  repayVai,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const limitTokens = React.useMemo(() => {
    const limitWei =
      userBalanceWei && userMintedWei
        ? BigNumber.minimum(userBalanceWei, userMintedWei)
        : new BigNumber(0);

    return convertWeiToCoins({ value: limitWei, tokenId: VAI_ID }).toString();
  }, [userBalanceWei?.toString(), userMintedWei?.toString()]);

  // Convert minted wei into VAI
  const readableRepayableVai = useConvertToReadableCoinString({
    valueWei: userMintedWei,
    tokenId: VAI_ID,
  });

  const hasRepayableVai = userMintedWei?.isGreaterThan(0) || false;

  const onSubmit: IAmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertCoinsToWei({
      value: new BigNumber(amountTokens),
      tokenId: VAI_ID,
    });

    try {
      // Send request to repay VAI
      const res = await repayVai(amountWei);

      // Display successful transaction modal
      openSuccessfulTransactionModal({
        title: t('mintRepayVai.mintVai.successfulTransactionModal.title'),
        message: t('mintRepayVai.mintVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: 'xvs' as TokenId,
        },
        transactionHash: res.transactionHash,
      });
    } catch (error) {
      toast.error({ title: (error as Error).message });
    }
  };

  return (
    <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
      {({ values, setFieldValue, handleBlur, isValid, dirty }) => (
        <>
          <div css={styles.ctaContainer}>
            <TokenTextField
              name="amount"
              css={styles.textField}
              tokenId={VAI_ID}
              value={values.amount}
              onChange={amount => setFieldValue('amount', amount, true)}
              onBlur={handleBlur}
              max={limitTokens}
              disabled={disabled || isRepayVaiLoading || !hasRepayableVai}
              rightMaxButton={{
                label: t('mintRepayVai.repayVai.rightMaxButtonLabel'),
                valueOnClick: limitTokens,
              }}
            />

            <LabeledInlineContent
              css={styles.getRow({ isLast: true })}
              iconName={VAI_ID}
              label={t('mintRepayVai.repayVai.repayVaiBalance')}
            >
              {readableRepayableVai}
            </LabeledInlineContent>
          </div>

          <SecondaryButton
            type="submit"
            loading={isRepayVaiLoading}
            disabled={disabled || !isValid || !dirty}
            fullWidth
          >
            {t('mintRepayVai.repayVai.btnRepayVai')}
          </SecondaryButton>
        </>
      )}
    </AmountForm>
  );
};

const RepayVai: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { userVaiMinted, userVaiBalance } = useVaiUser();
  const { t } = useTranslation();

  const { mutateAsync: contractRepayVai, isLoading: isRepayVaiLoading } = useRepayVai();

  // Convert minted VAI balance into wei of VAI
  const userMintedWei = React.useMemo(
    () => convertCoinsToWei({ value: userVaiMinted, tokenId: VAI_ID }),
    [userVaiMinted.toString()],
  );

  // Convert user VAI balance into wei of VAI
  const userBalanceWei = React.useMemo(
    () => convertCoinsToWei({ value: userVaiBalance, tokenId: VAI_ID }),
    [userVaiBalance.toString()],
  );

  const repayVai: IRepayVaiUiProps['repayVai'] = amountWei => {
    if (!account) {
      const errorMessage = t('mintRepayVai.repayVai.undefinedAccountErrorMessage');
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new InternalError(errorMessage);
    }

    return contractRepayVai({
      fromAccountAddress: account.address,
      amountWei: amountWei.toString(),
    });
  };

  // @TODO: wrap with EnableToken component once created
  return (
    <RepayVaiUi
      disabled={!account}
      userBalanceWei={userBalanceWei}
      userMintedWei={userMintedWei}
      isRepayVaiLoading={isRepayVaiLoading}
      repayVai={repayVai}
    />
  );
};

export default RepayVai;
