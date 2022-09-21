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
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';
import type { TransactionReceipt } from 'web3-core';

import { useGetBalanceOf, useGetMintedVai, useRepayVai } from 'clients/api';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { VAI_ID } from '../constants';
import { useStyles } from '../styles';

const vaiUnitrollerContractAddress = getContractAddress('vaiUnitroller');

export interface IRepayVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  repayVai: (amountWei: BigNumber) => Promise<TransactionReceipt | undefined>;
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

    return convertWeiToTokens({ valueWei: limitWei, tokenId: VAI_ID }).toFixed();
  }, [userBalanceWei?.toFixed(), userMintedWei?.toFixed()]);

  // Convert minted wei into VAI
  const readableRepayableVai = useConvertWeiToReadableTokenString({
    valueWei: userMintedWei,
    tokenId: VAI_ID,
  });

  const hasRepayableVai = userMintedWei?.isGreaterThan(0) || false;

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      tokenId: VAI_ID,
    });

    return handleTransactionMutation({
      mutate: () => repayVai(amountWei),
      successTransactionModalProps: transactionReceipt => ({
        title: t('vai.repayVai.successfulTransactionModal.title'),
        content: t('vai.repayVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: 'vai',
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('vai.repayVai.connectWallet')}>
      <EnableToken
        title={t('vai.repayVai.enableToken')}
        vTokenId={VAI_ID}
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
                    tokenId={VAI_ID}
                    max={limitTokens}
                    disabled={disabled || isSubmitting || !hasRepayableVai}
                    rightMaxButton={{
                      label: t('vai.repayVai.rightMaxButtonLabel'),
                      valueOnClick: limitTokens,
                    }}
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: true })}
                    iconName={VAI_ID}
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
  const { account } = useContext(AuthContext);
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
      tokenId: TOKENS.vai.id as TokenId,
    },
    {
      enabled: !!account?.address,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    },
  );

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
      isInitialLoading={isGetMintedVaiLoading || isGetUserVaiBalance}
      isSubmitting={isSubmitting}
      repayVai={repayVai}
    />
  );
};

export default RepayVai;
