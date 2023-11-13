import { ButtonWrapper, Card, Icon, Link } from 'components';
import { useTranslation } from 'packages/translations';

import { PRIME_DOC_URL } from 'constants/prime';

import boostsIllustration from './boostsIllustration.png';
import illustrationSm from './illustrationSm.png';
import primeTokenIllustration from './primeTokenIllustration.png';
import TEST_IDS from './testIds';

export interface PrimePromotionalBannerProps {
  onHide: () => void;
}

export const PrimePromotionalBanner: React.FC<PrimePromotionalBannerProps> = ({ onHide }) => {
  const { t, Trans } = useTranslation();

  return (
    <Card className="relative mb-8 border border-lightGrey py-6 sm:p-0 md:p-0">
      <button
        onClick={onHide}
        className="absolute right-4 top-4 z-10"
        type="button"
        data-testid={TEST_IDS.closeButton}
      >
        <Icon name="close" className="h-6 w-6 text-offWhite hover:text-grey" />
      </button>

      <div className="sm:flex sm:flex-row">
        <div className="relative mb-6 justify-center overflow-hidden sm:order-2 sm:mb-0 sm:basis-4/12">
          {/* Mobile illustration */}
          <img
            src={illustrationSm}
            className="mx-auto h-35 max-w-none sm:hidden"
            alt={t('dashboard.primePromotionalBanner.illustration.alt')}
          />

          {/* SM and up illustration */}
          <img
            src={primeTokenIllustration}
            className="hidden sm:absolute sm:left-7 sm:top-[50%] sm:-mt-30 sm:block sm:h-60 sm:max-w-none md:-top-[12%] md:mt-0 md:h-[124%] lg:-top-[20%] lg:h-[140%] xl:-top-[30%] xl:h-[160%] xxl:-top-[40%] xxl:h-[180%]"
            alt={t('dashboard.primePromotionalBanner.illustration.alt')}
          />

          <img
            src={boostsIllustration}
            className="hidden sm:absolute sm:-bottom-3 sm:left-2 sm:block sm:h-24 md:bottom-0 xl:-bottom-4 xl:h-28"
            alt={t('dashboard.primePromotionalBanner.illustration.alt')}
          />
        </div>

        <div className="xxl:max-w-150 sm:order-1 sm:basis-8/12 sm:p-4 md:p-6">
          <div className="xxl:max-w-2xl">
            <p className="mb-2 text-lg">
              <Trans
                i18nKey="dashboard.primePromotionalBanner.title"
                components={{
                  Prime: (
                    <span className="bg-gradient-to-r from-[#BA8F7C] from-25% to-[#D4B9AB] to-50% bg-clip-text text-transparent" />
                  ),
                }}
              />
            </p>

            <p className="mb-8 text-sm text-grey xl:text-base">
              {t('dashboard.primePromotionalBanner.description')}
            </p>

            <ButtonWrapper variant="secondary" className="w-full sm:w-auto" asChild>
              <Link href={PRIME_DOC_URL} className="text-offWhite no-underline hover:no-underline">
                {t('dashboard.primePromotionalBanner.buttonLabel')}
              </Link>
            </ButtonWrapper>
          </div>
        </div>
      </div>
    </Card>
  );
};
