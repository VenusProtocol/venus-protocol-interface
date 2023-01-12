/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  Spinner,
} from 'components';
import { VError } from 'errors';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';
import type { TransactionReceipt } from 'web3-core';

import {
  useGetBalanceOf,
  useGetMintedVai,
  useGetVaiCalculateRepayAmount,
  useRepayVai,
} from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';
import TEST_IDS from './testIds';

const vaiUnitrollerContractAddress = getContractAddress('vaiUnitroller');

export interface IRepayVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  repayVai: (amountWei: BigNumber) => Promise<TransactionReceipt | undefined>;
  userBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
  repayFeeWei: BigNumber;
  feePercentage: number;
  setRepayAmount: (amount: string) => void;
}

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  userMintedWei,
  isInitialLoading,
  isSubmitting,
  repayVai,
  repayFeeWei,
  feePercentage,
  setRepayAmount,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const limitTokens = React.useMemo(() => {
    const limitWei =
      userBalanceWei && userMintedWei
        ? BigNumber.minimum(userBalanceWei, userMintedWei)
        : new BigNumber(0);

    return convertWeiToTokens({ valueWei: limitWei, token: TOKENS.vai }).toFixed();
  }, [userBalanceWei?.toFixed(), userMintedWei?.toFixed()]);

  // Convert minted wei into VAI
  const readableRepayableVai = useConvertWeiToReadableTokenString({
    valueWei: userMintedWei,
    token: TOKENS.vai,
  });

  const hasRepayableVai = userMintedWei?.isGreaterThan(0) || false;

  const getReadableRepayFee = useCallback(() => {
    const fee = convertWeiToTokens({
      valueWei: repayFeeWei,
      token: TOKENS.vai,
      returnInReadableFormat: true,
    });
    return `${fee} (${feePercentage}%)`;
  }, [repayFeeWei, feePercentage]);

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token: TOKENS.vai,
    });

    return handleTransactionMutation({
      mutate: () => repayVai(amountWei),
      successTransactionModalProps: transactionReceipt => ({
        title: t('vai.repayVai.successfulTransactionModal.title'),
        content: t('vai.repayVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.vai,
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('vai.repayVai.connectWallet')}>
      <EnableToken
        title={t('vai.repayVai.enableToken')}
        token={TOKENS.vai}
        spenderAddress={vaiUnitrollerContractAddress}
      >
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
            {({ values }) => {
              useEffect(() => {
                // fix: debounce
                setRepayAmount(values.amount);
              }, [values.amount]);

              return (
                <>
                  <div css={styles.ctaContainer}>
                    <FormikTokenTextField
                      name="amount"
                      css={styles.textField}
                      token={TOKENS.vai}
                      max={limitTokens}
                      disabled={disabled || isSubmitting || !hasRepayableVai}
                      rightMaxButton={{
                        label: t('vai.repayVai.rightMaxButtonLabel'),
                        valueOnClick: limitTokens,
                      }}
                      data-testid={TEST_IDS.repayTextField}
                    />

                    <LabeledInlineContent
                      css={styles.getRow({ isLast: true })}
                      iconSrc={TOKENS.vai}
                      label={t('vai.repayVai.repayVaiBalance')}
                    >
                      {readableRepayableVai}
                    </LabeledInlineContent>
                    {/* fix: add info tooltip */}
                    <LabeledInlineContent
                      css={styles.getRow({ isLast: true })}
                      iconSrc="fee"
                      label={t('vai.repayVai.repayFeeLabel')}
                    >
                      {getReadableRepayFee()}
                    </LabeledInlineContent>
                  </div>

                  <FormikSubmitButton
                    loading={isSubmitting}
                    disabled={disabled}
                    enabledLabel={t('vai.repayVai.submitButtonLabel')}
                    disabledLabel={t('vai.repayVai.submitButtonDisabledLabel')}
                    fullWidth
                  />
                </>
              );
            }}
          </AmountForm>
        )}
      </EnableToken>
    </ConnectWallet>
  );
};

const RepayVai: React.FC = () => {
  const { account } = useContext(AuthContext);
  const [repayAmountWei, setRepayAmountWei] = useState<string>('');
  const { data: mintedVaiData, isLoading: isGetMintedVaiLoading } = useGetMintedVai(
    {
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const { data: userVaiBalanceData, isLoading: isGetUserVaiBalance } = useGetBalanceOf(
    {
      accountAddress: account?.address || '',
      token: TOKENS.vai,
    },
    {
      enabled: !!account?.address,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const {
    data: vaiRepayAmountData,
    isLoading: isGetVaiCalculateRepayAmountLoading,
    refetch,
  } = useGetVaiCalculateRepayAmount(
    {
      accountAddress: account?.address || '',
      repayAmountWei: new BigNumber(repayAmountWei || 0),
    },
    {
      enabled: !!account?.address || !!repayAmountWei,
    },
  );

  useEffect(() => {
    refetch();
  }, [repayAmountWei]);

  const { mutateAsync: contractRepayVai, isLoading: isSubmitting } = useRepayVai();

  const repayVai: IRepayVaiUiProps['repayVai'] = async amountWei => {
    if (!account) {
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new VError({ type: 'unexpected', code: 'undefinedAccountErrorMessage' });
    }
    return contractRepayVai({
      fromAccountAddress: account.address,
      amountWei: amountWei.toFixed(),
    });
  };

  return (
    <RepayVaiUi
      disabled={!account}
      userBalanceWei={userVaiBalanceData?.balanceWei}
      userMintedWei={mintedVaiData?.mintedVaiWei}
      isInitialLoading={
        isGetMintedVaiLoading || isGetUserVaiBalance || isGetVaiCalculateRepayAmountLoading
      }
      isSubmitting={isSubmitting}
      repayVai={repayVai}
      repayFeeWei={vaiRepayAmountData?.vaiToBeBurned || new BigNumber(0)}
      feePercentage={vaiRepayAmountData?.feePercentage || 0}
      setRepayAmount={setRepayAmountWei}
    />
  );
};

export default RepayVai;
