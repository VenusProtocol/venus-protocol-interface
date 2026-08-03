import type BigNumber from 'bignumber.js';

import { Card, Delimiter, LabeledInlineContent } from 'components';
import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';
import TokenAmountAndApy from './TokenAmountAndApy';

const PRIME_APY_DOC_URL = `${VENUS_DOC_URL}/technical-reference/reference-technical-articles/prime#calculate-apr-associated-with-a-prime-market-and-user`;

interface RewardDetailsProps {
  token: Token;
  totalDailyRewards: BigNumber | undefined;
  userDailyRewards: BigNumber | undefined;
  userSuppliedTokens: BigNumber | undefined;
  userBorrowedTokens: BigNumber | undefined;
  primeSupplyApy: BigNumber | undefined;
  primeBorrowApy: BigNumber | undefined;
}

export const RewardDetails: React.FC<RewardDetailsProps> = ({
  primeBorrowApy,
  primeSupplyApy,
  token,
  totalDailyRewards,
  userBorrowedTokens,
  userSuppliedTokens,
  userDailyRewards,
}: RewardDetailsProps) => {
  const { t, Trans } = useTranslation();

  const suppliedTokensReadable = formatTokensToReadableValue({
    value: userSuppliedTokens,
    token,
  });

  const borrowedTokensReadable = formatTokensToReadableValue({
    value: userBorrowedTokens,
    token,
  });

  const primeTokensDistributedAmountReadable = formatTokensToReadableValue({
    value: totalDailyRewards,
    token,
  });

  const userDailyPrimeRewardsReadable = formatTokensToReadableValue({
    value: userDailyRewards,
    token,
  });

  const borrowApyPercentageReadable = formatPercentageToReadableValue(
    primeBorrowApy?.multipliedBy(-1),
  );
  const supplyApyPercentageReadable = formatPercentageToReadableValue(primeSupplyApy);

  return (
    <Card>
      <h4 className="text-lg font-semibold">{t('primeCalculator.rewardDetails.title')}</h4>
      <div className="my-6 space-y-3">
        <LabeledInlineContent
          className="flex-1"
          iconSrc={token}
          tooltip={t('primeCalculator.rewardDetails.totalDailyRewards.tooltip')}
          label={t('primeCalculator.rewardDetails.totalDailyRewards.title')}
        >
          {primeTokensDistributedAmountReadable}
        </LabeledInlineContent>
        <LabeledInlineContent
          className="flex-1"
          iconSrc={token}
          label={t('primeCalculator.rewardDetails.yourDailyRewards')}
        >
          {userDailyPrimeRewardsReadable}
        </LabeledInlineContent>
      </div>

      <Delimiter />

      <div className="mt-6 space-y-8 lg:space-y-6">
        <TokenAmountAndApy
          apy={supplyApyPercentageReadable}
          apyTitle={t('primeCalculator.rewardDetails.primeSupplyApy.title')}
          apyTooltip={
            <Trans
              i18nKey="primeCalculator.rewardDetails.primeSupplyApy.tooltip"
              components={{
                Link: <Link href={PRIME_APY_DOC_URL} />,
              }}
            />
          }
          tokenAmount={suppliedTokensReadable}
          tokenAmountTitle={t('primeCalculator.rewardDetails.fromSuppliedTokens', {
            tokenSymbol: token.symbol,
          })}
        />

        <TokenAmountAndApy
          apy={borrowApyPercentageReadable}
          apyTitle={t('primeCalculator.rewardDetails.primeBorrowApy.title')}
          apyTooltip={
            <Trans
              i18nKey="primeCalculator.rewardDetails.primeBorrowApy.tooltip"
              components={{
                Link: <Link href={PRIME_APY_DOC_URL} />,
              }}
            />
          }
          tokenAmount={borrowedTokensReadable}
          tokenAmountTitle={t('primeCalculator.rewardDetails.fromBorrowedTokens', {
            tokenSymbol: token.symbol,
          })}
        />
      </div>
    </Card>
  );
};
