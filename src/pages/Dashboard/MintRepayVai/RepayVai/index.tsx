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
import {
  convertTokensToWei,
  convertWeiToTokens,
  formatPercentage,
  getContractAddress,
} from 'utilities';
import type { TransactionReceipt } from 'web3-core';

import { useGetBalanceOf, useGetMintedVai, useRepayVai } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';
import RepayFee from './RepayFee';
import TEST_IDS from './testIds';

const vaiControllerContractAddress = getContractAddress('vaiController');

export interface RepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  repayVai: (amountWei: BigNumber) => Promise<TransactionReceipt | undefined>;
  isInitialLoading: boolean;
  apyPercentage?: BigNumber;
  userBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
}

export const RepayVaiUi: React.FC<RepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  userMintedWei,
  apyPercentage,
  isRepayVaiLoading,
  isInitialLoading,
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
      successTransactionModalProps: transactionReceipt => ({
        title: t('mintRepayVai.repayVai.successfulTransactionModal.title'),
        content: t('mintRepayVai.repayVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.vai,
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('mintRepayVai.repayVai.connectWallet')}>
      <EnableToken
        title={t('mintRepayVai.repayVai.enableToken')}
        token={TOKENS.vai}
        spenderAddress={vaiControllerContractAddress}
      >
        {isInitialLoading ? (
          <Spinner />
        ) : (
          <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
            {({ values }) => (
              <>
                <div css={styles.ctaContainer}>
                  <FormikTokenTextField
                    name="amount"
                    css={styles.textField}
                    token={TOKENS.vai}
                    max={limitTokens}
                    disabled={disabled || isRepayVaiLoading || !hasRepayableVai}
                    rightMaxButton={{
                      label: t('mintRepayVai.repayVai.rightMaxButtonLabel'),
                      valueOnClick: limitTokens,
                    }}
                    data-testid={TEST_IDS.repayTextField}
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconSrc={TOKENS.vai}
                    label={t('mintRepayVai.repayVai.repayVaiBalance')}
                  >
                    {readableRepayableVai}
                  </LabeledInlineContent>

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconSrc="fee"
                    label={t('mintRepayVai.repayVai.apy')}
                  >
                    {apyPercentage ? `${formatPercentage(apyPercentage)}%` : PLACEHOLDER_KEY}
                  </LabeledInlineContent>

                  <RepayFee repayAmountTokens={values.amount} />
                </div>

                <FormikSubmitButton
                  variant="secondary"
                  loading={isRepayVaiLoading}
                  disabled={disabled}
                  enabledLabel={t('mintRepayVai.repayVai.btnRepayVai')}
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

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const { data: userVaiBalanceData, isLoading: isGetUserVaiBalanceWeiLoading } = useGetBalanceOf(
    {
      accountAddress: account?.address || '',
      token: TOKENS.vai,
    },
    {
      enabled: !!account?.address,
    },
  );

  const { data: userMintedVaiData, isLoading: isGetUserMintedVaiLoading } = useGetMintedVai(
    {
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const isInitialLoading = isGetUserMintedVaiLoading || isGetUserVaiBalanceWeiLoading;

  const { mutateAsync: contractRepayVai, isLoading: isRepayVaiLoading } = useRepayVai();

  const repayVai: RepayVaiUiProps['repayVai'] = async amountWei => {
    if (!account) {
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new VError({ type: 'unexpected', code: 'undefinedAccountErrorMessage' });
    }

    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return contractRepayVai({
      fromAccountAddress: account.address,
      amountWei: amountWei.toFixed(),
    });
  };

  // TODO: fetch
  const fakeApyPercentage = new BigNumber(4);

  return (
    <RepayVaiUi
      disabled={!account}
      isInitialLoading={isInitialLoading}
      userBalanceWei={userVaiBalanceData?.balanceWei}
      userMintedWei={userMintedVaiData?.mintedVaiWei}
      isRepayVaiLoading={isRepayVaiLoading}
      apyPercentage={fakeApyPercentage}
      repayVai={repayVai}
    />
  );
};

export default RepayVai;
