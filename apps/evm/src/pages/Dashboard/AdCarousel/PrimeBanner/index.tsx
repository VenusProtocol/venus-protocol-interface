import { ButtonWrapper } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import desktopIllustrationSrc from './desktopIllustration.png';

export const PrimeBanner: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <div className="rounded-2xl bg-linear-to-r from-[#0829AE] to-[#0254EB] p-4 relative sm:px-6 xl:h-102 xl:py-6">
      <img
        className="hidden absolute bottom-0 left-0 right-0 xl:block"
        src={desktopIllustrationSrc}
        alt={t('dashboard.adCarousel.primeBanner.illustration.altText')}
      />

      <div className="relative max-w-59 sm:max-w-86">
        <p className="text-lg font-semibold mb-2">
          <Trans
            i18nKey="dashboard.adCarousel.primeBanner.title"
            components={{
              Gradient: (
                <span className="bg-[linear-gradient(134deg,#BA8F7C_27.04%,#D4B9AB_48.89%)] bg-clip-text text-transparent" />
              ),
            }}
          />
        </p>

        <p className="mb-3 text-light-grey sm:mb-6">
          {t('dashboard.adCarousel.primeBanner.description')}
        </p>

        <ButtonWrapper
          size="sm"
          className="text-white bg-transparent hover:text-white active:text-white hover:no-underline active:no-underline"
          asChild
        >
          <Link to={routes.primeCalculator.path}>
            {t('dashboard.adCarousel.primeBanner.button.label')}
          </Link>
        </ButtonWrapper>
      </div>
    </div>
  );
};
