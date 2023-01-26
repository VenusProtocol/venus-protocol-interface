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
import { ContractReceipt } from 'ethers';
import React from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';

import { useGetBalanceOf, useGetMintedVai, useRepayVai } from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';

const vaiUnitrollerContractAddress = getContractAddress('vaiUnitroller');

export interface IRepayVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  repayVai: (amountWei: BigNumber) => Promise<ContractReceipt | undefined>;
  userBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
}

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  userMintedWei,
  isInitialLoading,
  isSubmitting,
  repayVai,
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
      <EnableToken
        title={t('vai.repayVai.enableToken')}
        token={TOKENS.vai}
        spenderAddress={vaiUnitrollerContractAddress}
      >
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
            {() => (
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
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: true })}
                    iconSrc={TOKENS.vai}
                    label={t('vai.repayVai.repayVaiBalance')}
                  >
                    {readableRepayableVai}
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
            )}
          </AmountForm>
        )}
      </EnableToken>
    </ConnectWallet>
  );
};

const RepayVai: React.FC = () => {
  const { account } = useAuth();
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

  const { mutateAsync: contractRepayVai, isLoading: isSubmitting } = useRepayVai();

  const repayVai: IRepayVaiUiProps['repayVai'] = async amountWei =>
    contractRepayVai({
      amountWei,
    });

  return (
    <RepayVaiUi
      disabled={!account}
      userBalanceWei={userVaiBalanceData?.balanceWei}
      userMintedWei={mintedVaiData?.mintedVaiWei}
      isInitialLoading={isGetMintedVaiLoading || isGetUserVaiBalance}
      isSubmitting={isSubmitting}
      repayVai={repayVai}
    />
  );
};

export default RepayVai;
