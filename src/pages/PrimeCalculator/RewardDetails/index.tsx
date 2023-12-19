import { Card, Delimiter, Icon, LabeledInlineContent, Tooltip } from 'components';
import { useTranslation } from 'packages/translations';
import { Token } from 'types';

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
      <div className="mb-3 mt-6 flex justify-between">
        <div className="flex w-full">
          <LabeledInlineContent
            className="flex-1"
            iconSrc={token}
            tooltip={t('primeCalculator.rewardDetails.totalYearlyRewards.tooltip')}
            label={t('primeCalculator.rewardDetails.totalYearlyRewards.title')}
          >
            {totalYearlyRewards}
          </LabeledInlineContent>
        </div>
      </div>
      <div className="mb-6 flex justify-between">
        <div className="flex w-full">
          <LabeledInlineContent
            className="flex-1"
            iconSrc={token}
            label={t('primeCalculator.rewardDetails.yourYearlyRewards')}
          >
            {userYearlyRewards}
          </LabeledInlineContent>
        </div>
      </div>

      <Delimiter />

      <div className="mb-8 mt-6 flex lg:mb-6">
        <div className="flex flex-col w-[110px] sm:w-35 md:w-[110px] lg:w-40">
          <span className="text-grey">{t('primeCalculator.rewardDetails.fromSuppliedTokens')}</span>
          <span>{userSuppliedTokens}</span>
        </div>
        <Icon name="blueArrowRight" className="mx-6 self-center lg:mx-3" />
        <div className="flex flex-col">
          <div className="flex">
            <span className="mr-2 text-grey">
              {t('primeCalculator.rewardDetails.primeSupplyApy.title')}
            </span>
            <Tooltip
              className="flex flex-col justify-center"
              title={t('primeCalculator.rewardDetails.primeSupplyApy.tooltip')}
            >
              <Icon name="info" />
            </Tooltip>
          </div>
          <span>{primeSupplyApy}</span>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col w-[110px] sm:w-35 md:w-[110px] lg:w-40">
          <span className="text-grey">{t('primeCalculator.rewardDetails.fromBorrowedTokens')}</span>
          <span>{userBorrowedTokens}</span>
        </div>
        <Icon name="blueArrowRight" className="mx-6 self-center lg:mx-3" />
        <div className="flex flex-col">
          <div className="flex">
            <span className="mr-2 text-grey">
              {t('primeCalculator.rewardDetails.primeBorrowApy.title')}
            </span>
            <Tooltip
              className="flex flex-col justify-center"
              title={t('primeCalculator.rewardDetails.primeBorrowApy.tooltip')}
            >
              <Icon name="info" />
            </Tooltip>
          </div>
          <span>{primeBorrowApy}</span>
        </div>
      </div>
    </Card>
  );
};
