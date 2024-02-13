import { ButtonWrapper, Card, Icon } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { usePrimeCalculatorPagePath } from 'hooks/usePrimeCalculatorPagePath';
import { useTranslation } from 'libs/translations';

import boostsIllustration from './boostsIllustration.png';
import illustrationSm from './illustrationSm.png';
import primeTokenIllustration from './primeTokenIllustration.png';
import TEST_IDS from './testIds';

export interface PrimePromotionalBannerProps {
  onHide: () => void;
}

export const PrimePromotionalBanner: React.FC<PrimePromotionalBannerProps> = ({ onHide }) => {
  const { t, Trans } = useTranslation();
  const primeCalculatorPagePath = usePrimeCalculatorPagePath();
  const isPrimeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

  return (
    <Card className="border-lightGrey relative mb-8 overflow-hidden border py-6 sm:p-0 md:p-0">
      <button
        onClick={onHide}
        className="absolute right-4 top-4 z-10"
        type="button"
        data-testid={TEST_IDS.closeButton}
      >
        <Icon name="close" className="text-offWhite hover:text-grey h-6 w-6" />
      </button>

      <div className="sm:flex sm:flex-row">
        <div className="relative mb-6 justify-center sm:order-2 sm:mb-0 sm:basis-4/12">
          {/* Mobile illustration */}
          <img
            src={illustrationSm}
            className="h-35 mx-auto max-w-none sm:hidden"
            alt={t('dashboard.primePromotionalBanner.illustration.alt')}
          />

          {/* SM and up illustration */}
          <img
            src={primeTokenIllustration}
            className="sm:-mt-30 xxl:-top-[40%] xxl:h-[180%] hidden sm:absolute sm:left-7 sm:top-[50%] sm:block sm:h-60 sm:max-w-none md:-top-[12%] md:mt-0 md:h-[124%] lg:-top-[20%] lg:h-[140%] xl:-top-[30%] xl:h-[160%]"
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

            <p className="text-grey mb-8 text-sm xl:text-base">
              {t('dashboard.primePromotionalBanner.description')}
            </p>

            <ButtonWrapper variant="secondary" className="w-full sm:w-auto" asChild>
              {isPrimeCalculatorEnabled ? (
                <Link
                  to={primeCalculatorPagePath}
                  className="text-offWhite no-underline hover:no-underline"
                >
                  {t('dashboard.primePromotionalBanner.buttonLabel.primeCalculator')}
                </Link>
              ) : (
                <Link
                  href={PRIME_DOC_URL}
                  className="text-offWhite no-underline hover:no-underline"
                >
                  {t('dashboard.primePromotionalBanner.buttonLabel.primeDoc')}
                </Link>
              )}
            </ButtonWrapper>
          </div>
        </div>
      </div>
    </Card>
  );
};
