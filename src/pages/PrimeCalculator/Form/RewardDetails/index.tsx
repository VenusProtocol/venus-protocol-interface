import { Card, Delimiter, LabeledInlineContent } from 'components';
import { useTranslation } from 'packages/translations';
import { Token } from 'types';

import TokenAmountAndApy from './TokenAmountAndApy';

interface RewardDetailsProps {
  token: Token;
  totalYearlyRewards: string;
  userYearlyRewards: string;
  userSuppliedTokens: string;
  userBorrowedTokens: string;
  primeSupplyApy: string;
  primeBorrowApy: string;
}

export const RewardDetails: React.FC<RewardDetailsProps> = ({
  primeBorrowApy,
  primeSupplyApy,
  token,
  totalYearlyRewards,
  userBorrowedTokens,
  userSuppliedTokens,
  userYearlyRewards,
}: RewardDetailsProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <h4 className="text-lg font-semibold">{t('primeCalculator.rewardDetails.title')}</h4>
      <div className="my-6 space-y-3">
        <LabeledInlineContent
          className="flex-1"
          iconSrc={token}
          tooltip={t('primeCalculator.rewardDetails.totalYearlyRewards.tooltip')}
          label={t('primeCalculator.rewardDetails.totalYearlyRewards.title')}
        >
          {totalYearlyRewards}
        </LabeledInlineContent>
        <LabeledInlineContent
          className="flex-1"
          iconSrc={token}
          label={t('primeCalculator.rewardDetails.yourYearlyRewards')}
        >
          {userYearlyRewards}
        </LabeledInlineContent>
      </div>

      <Delimiter />

      <div className="mt-6 space-y-8 lg:space-y-6">
        <TokenAmountAndApy
          apy={primeSupplyApy}
          apyTitle={t('primeCalculator.rewardDetails.primeSupplyApy.title')}
          apyTooltip={t('primeCalculator.rewardDetails.primeSupplyApy.tooltip')}
          tokenAmount={userSuppliedTokens}
          tokenAmountTitle={t('primeCalculator.rewardDetails.fromSuppliedTokens')}
        />

        <TokenAmountAndApy
          apy={primeBorrowApy}
          apyTitle={t('primeCalculator.rewardDetails.primeBorrowApy.title')}
          apyTooltip={t('primeCalculator.rewardDetails.primeBorrowApy.tooltip')}
          tokenAmount={userBorrowedTokens}
          tokenAmountTitle={t('primeCalculator.rewardDetails.fromBorrowedTokens')}
        />
      </div>
    </Card>
  );
};
