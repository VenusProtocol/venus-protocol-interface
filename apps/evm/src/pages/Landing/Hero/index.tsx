import { useGetMarketsTvl } from 'clients/api/queries/getMarketsTvl/useGetMarketsTvl';
import { Wrapper } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { Galaxy } from './Galaxy';
import { HeroTabs } from './HeroTabs';
import CoinIconRow from './coinIconRow.svg';

export const Hero: React.FC = () => {
  const { t, Trans } = useTranslation();

  const { data: getMarketsTvlData } = useGetMarketsTvl();
  const readableMarketsTvl = formatCentsToReadableValue({
    value: getMarketsTvlData?.suppliedSumCents,
    shorten: false,
    maxDecimalPlaces: 0,
  });

  const isMdOrUp = useBreakpointUp('md');

  return (
    <div className="relative h-auto xl:min-h-175 w-full bg-background-active mb-10 lg:mb-15">
      {/* We use JS to conditionally render the galaxy background so that it does not load on mobile, where it won't be displayed anyway */}
      {isMdOrUp && <Galaxy />}

      <Wrapper className="flex flex-col start-0 end-0">
        <div className="flex flex-col items-center xl:flex-row xl:justify-between xl:items-stretch gap-6 w-full py-15 z-1">
          <div className="flex flex-col sm:max-w-140.5 items-center text-center xl:items-start xl:text-start">
            <h1 className="text-[48px] leading-[1.2] sm:text-[72px] sm:leading-none font-semibold lg:leading-none">
              <Trans
                i18nKey="landing.hero.title"
                components={{
                  br: <br />,
                  hl: <span className="text-blue" />,
                }}
              />
            </h1>

            <div className="mt-4 text-p3r sm:text-p2r xl:text-p2r">
              {t('landing.hero.subtitle')}
            </div>

            <img
              loading="lazy"
              src={CoinIconRow}
              alt="coin-logos"
              className="h-8 sm:h-10 mt-4 mx-auto xl:mx-0"
            />

            <div className="pb-6 pt-12 xl:pt-30">
              <div className="text-p3s sm:text-p1s lg:text-p2s">{t('landing.hero.venusTvl')}</div>

              <div className="text-h5 sm:text-h3">{readableMarketsTvl}</div>
            </div>
          </div>

          <HeroTabs />
        </div>
      </Wrapper>
    </div>
  );
};
