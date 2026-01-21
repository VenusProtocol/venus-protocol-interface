import { useGetMarketsTvl } from 'clients/api/queries/getMarketsTvl/useGetMarketsTvl';
import { Wrapper } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useTranslation } from 'libs/translations';
import { Galaxy } from './Galaxy';
import { HeroTabs } from './HeroTabs';
import CoinIconRow from './assets/coinIconRow.svg';

export const Hero: React.FC = () => {
  const { t, Trans } = useTranslation();

  const { data: tvlData, isLoading } = useGetMarketsTvl();

  return (
    <div className="relative h-auto xl:min-h-175 w-full bg-black">
      <Galaxy />
      <Wrapper className="flex flex-col start-0 end-0">
        <div className="flex flex-col items-center xl:flex-row xl:justify-between xl:items-stretch gap-6 w-full py-15 z-1">
          {/* Left Column */}
          <div className="flex flex-col sm:max-w-140.5 items-center text-center xl:items-start xl:text-start">
            <h1 className="text-[48px] leading-[1.2] sm:text-[72px] sm:leading-none xl:text-[80px] font-semibold lg:leading-none">
              <Trans
                i18nKey="landing.hero.title"
                components={{
                  br: <br />,
                  hl: <span className="text-blue" />,
                }}
              />
            </h1>
            <div className="mt-4 text-p3r sm:text-p2r">{t('landing.hero.subtitle')}</div>
            <img
              loading="lazy"
              src={CoinIconRow}
              alt="coin-logos"
              className="h-6 sm:h-10 mt-4 mx-auto xl:mx-0"
            />
            <div className="pb-6 pt-12 xl:pt-30">
              <div className="text-p1s sm:text-p3s">{t('landing.hero.venusTvl')}</div>
              <div className="xl:mt-4 text-h5 sm:text-h3">
                {isLoading ? PLACEHOLDER_KEY : tvlData?.totalLiquidityUsd}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <HeroTabs />
        </div>
      </Wrapper>
    </div>
  );
};
