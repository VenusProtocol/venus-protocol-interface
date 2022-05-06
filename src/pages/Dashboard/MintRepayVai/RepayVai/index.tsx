/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { TokenId } from 'types';
import { getToken } from 'utilities';
import { convertCoinsToWei, convertWeiToCoins } from 'utilities/common';
import { InternalError } from 'utilities/errors';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import {
  ConnectWallet,
  EnableToken,
  IconName,
  ILabeledInlineContentProps,
  FormikSubmitButton,
  LabeledInlineContent,
  FormikTokenTextField,
} from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useRepayVai } from 'clients/api';
import toast from 'components/Basic/Toast';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { VAI_ID } from '../constants';
import { useStyles } from '../styles';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isRepayVaiLoading: boolean;
  repayVai: (amountWei: BigNumber) => Promise<TransactionReceipt>;
  userBalanceWei?: BigNumber;
  userMintedWei?: BigNumber;
  userVaiEnabled: boolean;
}

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  userMintedWei,
  isRepayVaiLoading,
  repayVai,
  userVaiEnabled,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const vaiToken = getToken(VAI_ID);
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
        title: t('mintRepayVai.repayVai.successfulTransactionModal.title'),
        message: t('mintRepayVai.repayVai.successfulTransactionModal.message'),
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
  const tokenInfo: ILabeledInlineContentProps[] = [
    {
      label: t('mintRepayVai.repayVai.repayVaiBalance'),
      iconName: VAI_ID as IconName,
      children: readableRepayableVai,
    },
  ];

  return (
    <ConnectWallet message={t('mintRepayVai.repayVai.connectWallet')}>
      <EnableToken
        assetId={VAI_ID}
        title={t('mintRepayVai.repayVai.enableToken')}
        tokenInfo={tokenInfo}
        isEnabled={!!userVaiEnabled}
        vtokenAddress={vaiToken.address}
      >
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
  const { userVaiMinted, userVaiBalance, userVaiEnabled } = useVaiUser();
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
      userVaiEnabled={userVaiEnabled}
    />
  );
};

export default RepayVai;
