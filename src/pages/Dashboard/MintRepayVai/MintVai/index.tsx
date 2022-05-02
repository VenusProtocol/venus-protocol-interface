/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core';

import { TokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { getToken } from 'utilities';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { convertCoinsToWei, convertWeiToCoins } from 'utilities/common';
import { InternalError } from 'utilities/errors';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import {
  EnableToken,
  IconName,
  ILabeledInlineContentProps,
  SecondaryButton,
  LabeledInlineContent,
  TokenTextField,
} from 'components';
import { useVaiUser } from 'hooks/useVaiUser';
import { useGetVaiTreasuryPercentage, useMintVai } from 'clients/api';
import toast from 'components/Basic/Toast';
import { useTranslation } from 'translation';
import useConvertToReadableCoinString from '../useConvertToReadableCoinString';
import { VAI_ID } from '../constants';
import getReadableFeeVai from './getReadableFeeVai';
import { useStyles } from '../styles';

export interface IMintVaiUiProps {
  disabled: boolean;
  isMintVaiLoading: boolean;
  mintVai: (value: BigNumber) => Promise<TransactionReceipt>;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
  userVaiEnabled: boolean;
}

export const MintVaiUi: React.FC<IMintVaiUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isMintVaiLoading,
  mintVai,
  userVaiEnabled,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const vaiToken = getToken(VAI_ID);
  const limitTokens = React.useMemo(
    () => (limitWei ? convertWeiToCoins({ value: limitWei, tokenId: VAI_ID }).toString() : '0'),
    [limitWei?.toString()],
  );

  // Convert limit into VAI
  const readableVaiLimit = useConvertToReadableCoinString({
    valueWei: limitWei,
    tokenId: VAI_ID,
  });

  const hasMintableVai = limitWei?.isGreaterThan(0) || false;

  const getReadableMintFee = React.useCallback(
    (valueWei: string) => {
      if (!mintFeePercentage) {
        return '-';
      }

      const readableFeeVai = getReadableFeeVai({
        valueWei: new BigNumber(valueWei || 0),
        mintFeePercentage,
      });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage],
  );

  const onSubmit: IAmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertCoinsToWei({
      value: new BigNumber(amountTokens),
      tokenId: VAI_ID,
    });

    try {
      // Send request to repay VAI
      const res = await mintVai(amountWei);

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

  const tokenInfo: ILabeledInlineContentProps[] = [
    {
      label: t('mintRepayVai.mintVai.vaiLimitLabel'),
      iconName: VAI_ID as IconName,
      children: readableVaiLimit,
    },
    {
      label: t('mintRepayVai.mintVai.mintFeeLabel'),
      iconName: 'xvs' as IconName,
      children: getReadableMintFee(limitWei?.toFixed() || '0'),
    },
  ];

  return (
    <EnableToken
      symbol={VAI_ID.toUpperCase()}
      assetId={VAI_ID}
      title={t('mintRepayVai.mintVai.enableToken')}
      tokenInfo={tokenInfo}
      isEnabled={!!userVaiEnabled}
      vtokenAddress={vaiToken.address}
    >
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
                disabled={disabled || isMintVaiLoading || !hasMintableVai}
                rightMaxButton={{
                  label: t('mintRepayVai.mintVai.rightMaxButtonLabel'),
                  valueOnClick: limitTokens,
                }}
              />

              <LabeledInlineContent
                css={styles.getRow({ isLast: false })}
                iconName={VAI_ID}
                label={t('mintRepayVai.mintVai.vaiLimitLabel')}
              >
                {readableVaiLimit}
              </LabeledInlineContent>

              <LabeledInlineContent
                css={styles.getRow({ isLast: true })}
                iconName="fee"
                label={t('mintRepayVai.mintVai.mintFeeLabel')}
              >
                {getReadableMintFee(values.amount)}
              </LabeledInlineContent>
            </div>

            <SecondaryButton
              type="submit"
              loading={isMintVaiLoading}
              disabled={disabled || !isValid || !dirty}
              fullWidth
            >
              {t('mintRepayVai.mintVai.btnMintVai')}
            </SecondaryButton>
          </>
        )}
      </AmountForm>
    </EnableToken>
  );
};

const MintVai: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { mintableVai, userVaiEnabled } = useVaiUser();
  const { t } = useTranslation();

  const { data: vaiTreasuryPercentage, isLoading: isGetVaiTreasuryPercentageLoading } =
    useGetVaiTreasuryPercentage();

  const { mutateAsync: contractMintVai, isLoading: isMintVaiLoading } = useMintVai();

  // Convert limit into wei of VAI
  const limitWei = React.useMemo(
    () => convertCoinsToWei({ value: mintableVai, tokenId: VAI_ID }),
    [mintableVai.toString()],
  );

  const mintVai: IMintVaiUiProps['mintVai'] = async amountWei => {
    if (!account) {
      const errorMessage = t('mintRepayVai.mintVai.undefinedAccountErrorMessage');
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new InternalError(errorMessage);
    }

    return contractMintVai({
      fromAccountAddress: account.address,
      amountWei,
    });
  };

  return (
    <MintVaiUi
      disabled={!account || isGetVaiTreasuryPercentageLoading}
      limitWei={limitWei}
      mintFeePercentage={vaiTreasuryPercentage}
      isMintVaiLoading={isMintVaiLoading}
      mintVai={mintVai}
      userVaiEnabled={userVaiEnabled}
    />
  );
};

export default MintVai;
