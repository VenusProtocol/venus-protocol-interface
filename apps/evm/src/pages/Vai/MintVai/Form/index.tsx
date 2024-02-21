import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import {
  useGetBalanceOf,
  useGetMintableVai,
  useGetPrimeToken,
  useGetVaiRepayApy,
  useGetVaiTreasuryPercentage,
  useMintVai,
} from 'clients/api';
import {
  Delimiter,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  NoticeWarning,
  Spinner,
} from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { PRIME_DOC_URL } from 'constants/prime';
import { AmountForm } from 'containers/AmountForm';
import { Link } from 'containers/Link';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { VError, displayMutationError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Token } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
  generatePseudoRandomRefetchInterval,
} from 'utilities';

import TEST_IDS from '../../testIds';
import getReadableFeeVai from './getReadableFeeVai';

export interface MintVaiUiProps {
  disabled: boolean;
  shouldShowPrimeOnlyWarning: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  mintVai: (value: BigNumber) => Promise<unknown>;
  userBalanceMantissa?: BigNumber;
  apyPercentage?: BigNumber;
  limitMantissa?: BigNumber;
  mintFeePercentage?: number;
  vai: Token;
}

const userVaiRefetchInterval = generatePseudoRandomRefetchInterval();

export const Form: React.FC = () => {
  const { t, Trans } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const isUserPrime = !!getPrimeTokenData?.exists;
  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });
  const shouldShowPrimeOnlyWarning = isPrimeEnabled && !isUserPrime;

  const { data: mintableVaiData, isLoading: isGetMintableVaiLoading } = useGetMintableVai(
    {
      accountAddress: accountAddress || '',
      vai: vai!,
    },
    {
      enabled: !!accountAddress && !!vai,
    },
  );

  const limitMantissa = mintableVaiData?.mintableVaiMantissa;

  const isInitialLoading = isGetMintableVaiLoading || isGetPrimeTokenLoading;

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
  const userBalanceMantissa = userVaiBalanceData?.balanceMantissa;

  const { data: getVaiRepayApyData } = useGetVaiRepayApy();

  const { data: vaiTreasuryData, isLoading: isGetVaiTreasuryPercentageLoading } =
    useGetVaiTreasuryPercentage();

  const mintFeePercentage = vaiTreasuryData?.percentage;

  const { mutateAsync: contractMintVai, isLoading: isSubmitting } = useMintVai();

  const mintVai: MintVaiUiProps['mintVai'] = async amountMantissa =>
    contractMintVai({
      amountMantissa,
    });

  const limitTokens = useMemo(
    () =>
      limitMantissa ? convertMantissaToTokens({ value: limitMantissa, token: vai }).toFixed() : '0',
    [limitMantissa, vai],
  );

  // Convert limit into VAI
  const readableVaiLimit = useConvertMantissaToReadableTokenString({
    value: limitMantissa,
    token: vai,
  });

  const readableWalletBalance = useConvertMantissaToReadableTokenString({
    value: userBalanceMantissa,
    token: vai,
  });

  const hasMintableVai = limitMantissa?.isGreaterThan(0) || false;

  const getReadableMintFee = useCallback(
    (value: string) => {
      if (!mintFeePercentage) {
        return PLACEHOLDER_KEY;
      }

      const readableFeeVai = getReadableFeeVai({
        value: new BigNumber(value || 0),
        mintFeePercentage,
        vai: vai!,
      });
      return `${readableFeeVai} (${mintFeePercentage}%)`;
    },
    [mintFeePercentage, vai],
  );

  const onSubmit = async (amountTokens: string) => {
    if (!vai) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(amountTokens),
      token: vai,
    });

    try {
      await mintVai(amountMantissa);
    } catch (error) {
      displayMutationError({ error });
    }
  };

  const isDisabled = !accountAddress || isGetVaiTreasuryPercentageLoading || isGetUserVaiBalance;

  if (isInitialLoading) {
    return <Spinner />;
  }

  if (shouldShowPrimeOnlyWarning) {
    return (
      <NoticeWarning
        data-testid={TEST_IDS.primeOnlyWarning}
        description={
          <Trans
            i18nKey="vai.mintVai.primeOnlyWarning"
            components={{
              WhiteText: <span className="text-offWhite" />,
              Link: <Link href={PRIME_DOC_URL} />,
            }}
          />
        }
      />
    );
  }

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, setValues }) => (
        <div className="space-y-6">
          <FormikTokenTextField
            name="amount"
            token={vai!}
            max={limitTokens}
            disabled={isDisabled || isSubmitting || !hasMintableVai}
            rightMaxButton={{
              label: t('vai.mintVai.rightMaxButtonLabel'),
              onClick: () =>
                setValues(currentValues => ({ ...currentValues, amount: limitTokens })),
            }}
          />

          <LabeledInlineContent label={t('vai.mintVai.walletBalance')}>
            {readableWalletBalance}
          </LabeledInlineContent>

          <Delimiter />

          <div className="space-y-4">
            <LabeledInlineContent iconSrc={vai} label={t('vai.mintVai.vaiLimitLabel')}>
              {readableVaiLimit}
            </LabeledInlineContent>

            <LabeledInlineContent iconSrc="fee" label={t('vai.mintVai.apy')}>
              {formatPercentageToReadableValue(getVaiRepayApyData?.repayApyPercentage)}
            </LabeledInlineContent>

            <LabeledInlineContent iconSrc="fee" label={t('vai.mintVai.mintFeeLabel')}>
              {getReadableMintFee(values.amount)}
            </LabeledInlineContent>
          </div>

          <FormikSubmitButton
            loading={isSubmitting}
            disabled={isDisabled}
            className="w-full"
            enabledLabel={t('vai.mintVai.submitButtonLabel')}
            disabledLabel={t('vai.mintVai.submitButtonDisabledLabel')}
          />
        </div>
      )}
    </AmountForm>
  );
};
