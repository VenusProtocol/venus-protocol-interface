/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ApproveToken,
  ConnectWallet,
  FormikSubmitButton,
  LabeledInlineContent,
  NoticeWarning,
  Spinner,
} from 'components';
import { ContractReceipt } from 'ethers';
import React from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';

import {
  useGetBalanceOf,
  useGetMintedVai,
  useGetVaiRepayAmountWithInterests,
  useRepayVai,
} from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import MAX_UINT256 from 'constants/maxUint256';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import FormikTokenTextFieldWithBalance from '../TextFieldWithBalance';
import { useStyles } from '../styles';
import RepayFee from './RepayFee';

const vaiControllerContractAddress = getContractAddress('vaiController');

export interface IRepayVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  repayVai: (amountWei: BigNumber) => Promise<ContractReceipt | undefined>;
  userBalanceWei?: BigNumber;
  repayBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
}

const isPayingFullRepayBalance = (
  amount: string,
  repayBalanceWei: BigNumber | undefined,
): boolean => {
  if (amount && repayBalanceWei) {
    const amountWei = convertTokensToWei({ value: new BigNumber(amount), token: TOKENS.vai });
    return amountWei.isEqualTo(repayBalanceWei);
  }

  return false;
};

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  repayBalanceWei,
  userMintedWei,
  isInitialLoading,
  isSubmitting,
  repayVai,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const limitTokens = React.useMemo(() => {
    const limitWei =
      userBalanceWei && userMintedWei
        ? BigNumber.minimum(userBalanceWei, userMintedWei)
        : new BigNumber(0);

    return convertWeiToTokens({ valueWei: limitWei, token: TOKENS.vai }).toFixed();
  }, [userBalanceWei?.toFixed(), userMintedWei?.toFixed()]);

  // Convert repay balance (minted + interests) into VAI
  const readableRepayableVai = useConvertWeiToReadableTokenString({
    valueWei: repayBalanceWei,
    token: TOKENS.vai,
  });

  const hasRepayableVai = userMintedWei?.isGreaterThan(0) || false;

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token: TOKENS.vai,
    });

    return handleTransactionMutation({
      mutate: () => repayVai(amountWei),
      successTransactionModalProps: contractReceipt => ({
        title: t('vai.repayVai.successfulTransactionModal.title'),
        content: t('vai.repayVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.vai,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('vai.repayVai.connectWallet')}>
      <ApproveToken
        title={t('vai.repayVai.approveToken')}
        token={TOKENS.vai}
        spenderAddress={vaiControllerContractAddress}
      >
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
            {({ values }) => (
              <>
                <FormikTokenTextFieldWithBalance
                  disabled={disabled || isSubmitting || !hasRepayableVai}
                  maxValue={limitTokens}
                  userBalanceWei={userBalanceWei}
                  maxButtonLabel={t('vai.repayVai.rightMaxButtonLabel')}
                />

                <div css={styles.ctaContainer}>
                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconSrc={TOKENS.vai}
                    label={t('vai.repayVai.repayVaiBalance')}
                    tooltip={t('vai.repayVai.repayVaiBalanceTooltip')}
                  >
                    {readableRepayableVai}
                  </LabeledInlineContent>

                  <RepayFee repayAmountTokens={values.amount} />
                </div>

                {isPayingFullRepayBalance(values.amount, repayBalanceWei) && (
                  <NoticeWarning
                    css={styles.noticeWarning}
                    description={<Trans i18nKey="vai.repayVai.fullRepayWarning" />}
                  />
                )}

                <FormikSubmitButton
                  loading={isSubmitting}
                  disabled={disabled}
                  enabledLabel={t('vai.repayVai.submitButtonLabel')}
                  disabledLabel={t('vai.repayVai.submitButtonDisabledLabel')}
                  fullWidth
                />
              </>
            )}
          </AmountForm>
        )}
      </ApproveToken>
    </ConnectWallet>
  );
};

const RepayVai: React.FC = () => {
  const { accountAddress } = useAuth();
  const { data: mintedVaiData, isLoading: isGetMintedVaiLoading } = useGetMintedVai(
    {
      accountAddress,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const { data: repayAmountWithInterests, isLoading: isGetVaiRepayAmountWithInterests } =
    useGetVaiRepayAmountWithInterests(
      {
        accountAddress,
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: userVaiBalanceData, isLoading: isGetUserVaiBalance } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: TOKENS.vai,
    },
    {
      enabled: !!accountAddress,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

  const { mutateAsync: contractRepayVai, isLoading: isSubmitting } = useRepayVai();

  const repayVai: IRepayVaiUiProps['repayVai'] = async amountWei => {
    const isRepayingFullLoan = amountWei.eq(
      convertTokensToWei({
        value: repayAmountWithInterests!.vaiRepayAmountWithInterests,
        token: TOKENS.vai,
      }),
    );

    return contractRepayVai({
      amountWei: isRepayingFullLoan ? MAX_UINT256 : amountWei,
    });
  };

  return (
    <RepayVaiUi
      disabled={!accountAddress}
      userBalanceWei={userVaiBalanceData?.balanceWei}
      repayBalanceWei={repayAmountWithInterests?.vaiRepayAmountWithInterests}
      userMintedWei={mintedVaiData?.mintedVaiWei}
      isInitialLoading={
        isGetMintedVaiLoading || isGetUserVaiBalance || isGetVaiRepayAmountWithInterests
      }
      isSubmitting={isSubmitting}
      repayVai={repayVai}
    />
  );
};

export default RepayVai;
