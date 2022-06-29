/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { convertTokensToWei, convertWeiToTokens } from 'utilities';
import { VError } from 'errors';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  LabeledInlineContent,
  FormikTokenTextField,
} from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useRepayVai } from 'clients/api';
import { useTranslation } from 'translation';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import { VAI_ID } from '../constants';
import { useStyles } from '../styles';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  repayVai: (amountWei: BigNumber) => Promise<TransactionReceipt | undefined>;
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

  const onSubmit: IAmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      tokenId: VAI_ID,
    });

    return handleTransactionMutation({
      mutate: () => repayVai(amountWei),
      successTransactionModalProps: transactionReceipt => ({
        title: t('mintRepayVai.repayVai.successfulTransactionModal.title'),
        content: t('mintRepayVai.repayVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: 'vai',
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('mintRepayVai.repayVai.connectWallet')}>
      <EnableToken title={t('mintRepayVai.repayVai.enableToken')} vTokenId={VAI_ID}>
        <AmountForm onSubmit={onSubmit} css={styles.tabContentContainer}>
          {() => (
            <>
              <div css={styles.ctaContainer}>
                <FormikTokenTextField
                  name="amount"
                  css={styles.textField}
                  tokenId={VAI_ID}
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
      </EnableToken>
    </ConnectWallet>
  );
};

const RepayVai: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { userVaiMinted, userVaiBalance } = useVaiUser();

  const { mutateAsync: contractRepayVai, isLoading: isRepayVaiLoading } = useRepayVai();

  // Convert minted VAI balance into wei of VAI
  const userMintedWei = React.useMemo(
    () => convertTokensToWei({ value: userVaiMinted, tokenId: VAI_ID }),
    [userVaiMinted.toFixed()],
  );

  // Convert user VAI balance into wei of VAI
  const userBalanceWei = React.useMemo(
    () => convertTokensToWei({ value: userVaiBalance, tokenId: VAI_ID }),
    [userVaiBalance.toFixed()],
  );

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
      userBalanceWei={userBalanceWei}
      userMintedWei={userMintedWei}
      isRepayVaiLoading={isRepayVaiLoading}
      repayVai={repayVai}
    />
  );
};

export default RepayVai;
