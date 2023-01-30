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
import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens, getContractAddress } from 'utilities';
import type { TransactionReceipt } from 'web3-core';

import { useGetMintableVai, useGetVaiTreasuryPercentage, useMintVai } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';
import getReadableFeeVai from './getReadableFeeVai';

const vaiUnitrollerContractAddress = getContractAddress('vaiController');

export interface MintVaiUiProps {
  disabled: boolean;
  isMintVaiLoading: boolean;
  isInitialLoading: boolean;
  mintVai: (value: BigNumber) => Promise<TransactionReceipt | undefined>;
  limitWei?: BigNumber;
  mintFeePercentage?: number;
}

export const MintVaiUi: React.FC<MintVaiUiProps> = ({
  disabled,
  limitWei,
  isInitialLoading,
  mintFeePercentage,
  isMintVaiLoading,
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
      successTransactionModalProps: transactionReceipt => ({
        title: t('mintRepayVai.mintVai.successfulTransactionModal.title'),
        content: t('mintRepayVai.mintVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: TOKENS.vai,
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('mintRepayVai.mintVai.connectWallet')}>
      <EnableToken
        title={t('mintRepayVai.mintVai.enableToken')}
        token={TOKENS.vai}
        spenderAddress={vaiUnitrollerContractAddress}
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
                    disabled={disabled || isMintVaiLoading || !hasMintableVai}
                    rightMaxButton={{
                      label: t('mintRepayVai.mintVai.rightMaxButtonLabel'),
                      valueOnClick: limitTokens,
                    }}
                  />

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: false })}
                    iconSrc={TOKENS.vai}
                    label={t('mintRepayVai.mintVai.vaiLimitLabel')}
                  >
                    {readableVaiLimit}
                  </LabeledInlineContent>

                  <LabeledInlineContent
                    css={styles.getRow({ isLast: true })}
                    iconSrc="fee"
                    label={t('mintRepayVai.mintVai.mintFeeLabel')}
                  >
                    {getReadableMintFee(values.amount)}
                  </LabeledInlineContent>
                </div>

                <FormikSubmitButton
                  loading={isMintVaiLoading}
                  disabled={disabled}
                  fullWidth
                  variant="secondary"
                  enabledLabel={t('mintRepayVai.mintVai.btnMintVai')}
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
  const { account } = useContext(AuthContext);

  const { data: getUserMintableVaiWeiData, isLoading: isGetUserMintableVaiLoading } =
    useGetMintableVai(
      {
        accountAddress: account?.address || '',
      },
      {
        enabled: !!account?.address,
      },
    );

  const { data: vaiTreasuryPercentageData, isLoading: isGetVaiTreasuryPercentageLoading } =
    useGetVaiTreasuryPercentage();

  const { mutateAsync: contractMintVai, isLoading: isMintVaiLoading } = useMintVai();

  const mintVai: MintVaiUiProps['mintVai'] = async amountWei => {
    if (!account) {
      // This error should never happen, since the form inside the UI component
      // is disabled if there's no logged in account
      throw new VError({ type: 'unexpected', code: 'undefinedAccountErrorMessage' });
    }
    return contractMintVai({
      fromAccountAddress: account.address,
      amountWei,
    });
  };

  return (
    <MintVaiUi
      disabled={!account || isGetVaiTreasuryPercentageLoading}
      limitWei={getUserMintableVaiWeiData?.mintableVaiWei}
      isInitialLoading={isGetUserMintableVaiLoading}
      mintFeePercentage={vaiTreasuryPercentageData?.percentage}
      isMintVaiLoading={isMintVaiLoading}
      mintVai={mintVai}
    />
  );
};

export default MintVai;
