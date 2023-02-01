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
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';

import { useGetMintableVai, useGetVaiTreasuryPercentage, useMintVai } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';
import getReadableFeeVai from './getReadableFeeVai';

const vaiControllerContractAddress = getContractAddress('vaiController');

export interface MintVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  mintVai: (value: BigNumber) => Promise<ContractReceipt | undefined>;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
}

export const MintVaiUi: React.FC<MintVaiUiProps> = ({
  disabled,
  limitWei,
  mintFeePercentage,
  isInitialLoading,
  isSubmitting,
  mintVai,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const limitTokens = useMemo(
    () =>
      limitWei ? convertWeiToTokens({ valueWei: limitWei, token: TOKENS.vai }).toFixed() : '0',
    [limitWei?.toFixed()],
  );

  // Convert limit into VAI
  const readableVaiLimit = useConvertWeiToReadableTokenString({
    valueWei: limitWei,
    token: TOKENS.vai,
  });

  const hasMintableVai = limitWei?.isGreaterThan(0) || false;

  const getReadableMintFee = useCallback(
    (valueWei: string) => {
      if (!mintFeePercentage) {
        return PLACEHOLDER_KEY;
      }

      const readableFeeVai = getReadableFeeVai({
        valueWei: new BigNumber(valueWei || 0),
        mintFeePercentage,
      });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage],
  );

  const onSubmit: AmountFormProps['onSubmit'] = amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token: TOKENS.vai,
    });

    return handleTransactionMutation({
      mutate: () => mintVai(amountWei),
      successTransactionModalProps: contractReceipt => ({
        title: t('vai.mintVai.successfulTransactionModal.title'),
        content: t('vai.mintVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.vai,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('vai.mintVai.connectWallet')}>
      <EnableToken
        title={t('vai.mintVai.enableToken')}
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
                    disabled={disabled || isSubmitting || !hasMintableVai}
                    rightMaxButton={{
                      label: t('vai.mintVai.rightMaxButtonLabel'),
                      valueOnClick: limitTokens,
                    }}
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconSrc={TOKENS.vai}
                    label={t('vai.mintVai.vaiLimitLabel')}
                  >
                    {readableVaiLimit}
                  </LabeledInlineContent>

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: true })}
                    iconSrc="fee"
                    label={t('vai.mintVai.mintFeeLabel')}
                  >
                    {getReadableMintFee(values.amount)}
                  </LabeledInlineContent>
                </div>

                <FormikSubmitButton
                  loading={isSubmitting}
                  disabled={disabled}
                  fullWidth
                  enabledLabel={t('vai.mintVai.submitButtonLabel')}
                  disabledLabel={t('vai.mintVai.submitButtonDisabledLabel')}
                />
              </>
            )}
          </AmountForm>
        )}
      </EnableToken>
    </ConnectWallet>
  );
};

const MintVai: React.FC = () => {
  const { account } = useAuth();

  const { data: mintableVaiData, isLoading: isGetMintableVaiLoading } = useGetMintableVai(
    {
      accountAddress: account?.address || '',
    },
    {
      enabled: !!account?.address,
    },
  );

  const { data: vaiTreasuryData, isLoading: isGetVaiTreasuryPercentageLoading } =
    useGetVaiTreasuryPercentage();

  const { mutateAsync: contractMintVai, isLoading: isSubmitting } = useMintVai({});

  const mintVai: MintVaiUiProps['mintVai'] = async amountWei =>
    contractMintVai({
      amountWei,
    });

  return (
    <MintVaiUi
      disabled={!account || isGetVaiTreasuryPercentageLoading}
      limitWei={mintableVaiData?.mintableVaiWei}
      mintFeePercentage={vaiTreasuryData?.percentage}
      isInitialLoading={isGetMintableVaiLoading}
      isSubmitting={isSubmitting}
      mintVai={mintVai}
    />
  );
};

export default MintVai;
