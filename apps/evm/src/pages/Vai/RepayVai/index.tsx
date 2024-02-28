/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import { useGetBalanceOf, useGetVaiRepayAmountWithInterests, useRepayVai } from 'clients/api';
import {
  ApproveTokenSteps,
  ApproveTokenStepsProps,
  Delimiter,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  NoticeWarning,
  SpendingLimit,
  Spinner,
} from 'components';
import MAX_UINT256 from 'constants/maxUint256';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { ConnectWallet } from 'containers/ConnectWallet';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useTokenApproval from 'hooks/useTokenApproval';
import { useGetVaiControllerContractAddress } from 'libs/contracts';
import { displayMutationError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Token } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  generatePseudoRandomRefetchInterval,
} from 'utilities';

import { useStyles } from '../styles';
import TEST_IDS from '../testIds';
import RepayFee from './RepayFee';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  repayVai: ({
    amountMantissa,
    isRepayingFullLoan,
  }: {
    amountMantissa: BigNumber;
    isRepayingFullLoan: boolean;
  }) => Promise<unknown>;
  isVaiApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveVai: ApproveTokenStepsProps['approveToken'];
  isApproveVaiLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isVaiApprovalStatusLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  isRevokeVaiWalletSpendingLimitLoading: boolean;
  revokeVaiWalletSpendingLimit: () => Promise<unknown>;
  vai: Token;
  vaiWalletSpendingLimitTokens?: BigNumber;
  userBalanceMantissa?: BigNumber;
  repayBalanceMantissa?: BigNumber;
}

const userVaiRefetchInterval = generatePseudoRandomRefetchInterval();

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceMantissa,
  repayBalanceMantissa,
  isVaiApproved,
  approveVai,
  isApproveVaiLoading,
  isVaiApprovalStatusLoading,
  isInitialLoading,
  isSubmitting,
  isRevokeVaiWalletSpendingLimitLoading,
  revokeVaiWalletSpendingLimit,
  vaiWalletSpendingLimitTokens,
  repayVai,
  vai,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const limitTokens = useMemo(() => {
    const limitMantissa =
      userBalanceMantissa && repayBalanceMantissa
        ? BigNumber.minimum(userBalanceMantissa, repayBalanceMantissa)
        : new BigNumber(0);

    let tmpLimitTokens = convertMantissaToTokens({ value: limitMantissa, token: vai });

    if (isVaiApproved && vaiWalletSpendingLimitTokens) {
      tmpLimitTokens = BigNumber.minimum(tmpLimitTokens, vaiWalletSpendingLimitTokens);
    }

    return tmpLimitTokens.toFixed();
  }, [userBalanceMantissa, repayBalanceMantissa, vaiWalletSpendingLimitTokens, isVaiApproved, vai]);

  const isRepayingFullLoan = useCallback(
    ({ amountTokens }: { amountTokens: string }) => {
      if (amountTokens && repayBalanceMantissa) {
        const amountMantissa = convertTokensToMantissa({
          value: new BigNumber(amountTokens),
          token: vai,
        });
        return amountMantissa.isEqualTo(repayBalanceMantissa);
      }

      return false;
    },
    [repayBalanceMantissa, vai],
  );

  // Convert repay balance (minted + interests) into VAI
  const readableRepayableVai = useConvertMantissaToReadableTokenString({
    value: repayBalanceMantissa,
    token: vai,
  });

  const readableWalletBalance = useConvertMantissaToReadableTokenString({
    value: userBalanceMantissa,
    token: vai,
  });

  const walletBalanceTokens = useMemo(
    () =>
      userBalanceMantissa && convertTokensToMantissa({ value: userBalanceMantissa, token: vai }),
    [userBalanceMantissa, vai],
  );

  const hasRepayableVai = repayBalanceMantissa?.isGreaterThan(0) || false;

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(amountTokens),
      token: vai,
    });

    try {
      await repayVai({
        amountMantissa,
        isRepayingFullLoan: isRepayingFullLoan({ amountTokens }),
      });
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return (
    <ConnectWallet message={t('vai.repayVai.connectWallet')}>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <AmountForm onSubmit={onSubmit}>
          {({ values, isValid, dirty, setValues }) => (
            <>
              <FormikTokenTextField
                name="amount"
                css={styles.getRow({ isLast: true })}
                token={vai}
                max={limitTokens}
                disabled={disabled || isSubmitting || !hasRepayableVai}
                rightMaxButton={{
                  label: t('vai.repayVai.rightMaxButtonLabel'),
                  onClick: () =>
                    setValues(currentValues => ({ ...currentValues, amount: limitTokens })),
                }}
                data-testid={TEST_IDS.repayTextField}
              />

              <div css={styles.getRow({ isLast: true })}>
                <LabeledInlineContent
                  css={styles.getRow({ isLast: false })}
                  label={t('vai.repayVai.walletBalance')}
                >
                  {readableWalletBalance}
                </LabeledInlineContent>

                <SpendingLimit
                  token={vai}
                  walletBalanceTokens={walletBalanceTokens}
                  walletSpendingLimitTokens={vaiWalletSpendingLimitTokens}
                  onRevoke={revokeVaiWalletSpendingLimit}
                  isRevokeLoading={isRevokeVaiWalletSpendingLimitLoading}
                  data-testid={TEST_IDS.spendingLimit}
                />
              </div>

              <Delimiter css={styles.getRow({ isLast: true })} />

              <LabeledInlineContent
                css={styles.getRow({ isLast: false })}
                iconSrc={vai}
                label={t('vai.repayVai.repayVaiBalance')}
                tooltip={t('vai.repayVai.repayVaiBalanceTooltip')}
              >
                {readableRepayableVai}
              </LabeledInlineContent>

              <RepayFee repayAmountTokens={values.amount} />

              {isRepayingFullLoan({ amountTokens: values.amount }) && (
                <NoticeWarning
                  css={styles.noticeWarning}
                  description={<Trans i18nKey="vai.repayVai.fullRepayWarning" />}
                />
              )}

              <ApproveTokenSteps
                token={vai}
                hideTokenEnablingStep={!isValid || !dirty}
                isTokenApproved={isVaiApproved}
                approveToken={approveVai}
                isApproveTokenLoading={isApproveVaiLoading}
                isWalletSpendingLimitLoading={isVaiApprovalStatusLoading}
                secondStepButtonLabel={t('vai.repayVai.submitButtonLabel')}
              >
                <FormikSubmitButton
                  loading={isSubmitting}
                  disabled={
                    disabled ||
                    !dirty ||
                    isVaiApprovalStatusLoading ||
                    !isVaiApproved ||
                    isRevokeVaiWalletSpendingLimitLoading
                  }
                  enabledLabel={t('vai.repayVai.submitButtonLabel')}
                  disabledLabel={t('vai.repayVai.submitButtonDisabledLabel')}
                  className="w-full"
                />
              </ApproveTokenSteps>
            </>
          )}
        </AmountForm>
      )}
    </ConnectWallet>
  );
};

const RepayVai: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const vaiControllerContractAddress = useGetVaiControllerContractAddress();

  const { data: repayAmountWithInterests, isLoading: isGetVaiRepayAmountWithInterests } =
    useGetVaiRepayAmountWithInterests(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: userVaiBalanceData, isLoading: isGetUserVaiBalance } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: vai!,
    },
    {
      enabled: !!accountAddress,
      refetchInterval: userVaiRefetchInterval,
    },
  );

  const {
    isTokenApproved: isVaiApproved,
    approveToken: approveVai,
    isApproveTokenLoading: isApproveVaiLoading,
    isWalletSpendingLimitLoading: isVaiApprovalStatusLoading,
    walletSpendingLimitTokens: vaiWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeVaiWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeVaiWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: vai!,
    spenderAddress: vaiControllerContractAddress,
    accountAddress,
  });

  const { mutateAsync: contractRepayVai, isLoading: isSubmitting } = useRepayVai();

  const repayVai = async ({
    amountMantissa,
    isRepayingFullLoan,
  }: {
    amountMantissa: BigNumber;
    isRepayingFullLoan: boolean;
  }) =>
    contractRepayVai({
      amountMantissa: isRepayingFullLoan ? MAX_UINT256 : amountMantissa,
    });

  return (
    <RepayVaiUi
      disabled={!accountAddress}
      userBalanceMantissa={userVaiBalanceData?.balanceMantissa}
      repayBalanceMantissa={repayAmountWithInterests?.vaiRepayAmountWithInterestsMantissa}
      isInitialLoading={isGetUserVaiBalance || isGetVaiRepayAmountWithInterests}
      isSubmitting={isSubmitting}
      repayVai={repayVai}
      isVaiApproved={isVaiApproved}
      approveVai={approveVai}
      isApproveVaiLoading={isApproveVaiLoading}
      isVaiApprovalStatusLoading={isVaiApprovalStatusLoading}
      vaiWalletSpendingLimitTokens={vaiWalletSpendingLimitTokens}
      isRevokeVaiWalletSpendingLimitLoading={isRevokeVaiWalletSpendingLimitLoading}
      revokeVaiWalletSpendingLimit={revokeVaiWalletSpendingLimit}
      vai={vai!}
    />
  );
};

export default RepayVai;
