import { ButtonWrapper, cn } from 'components';

import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import venuePrimeXs from './assets/venusPrimeLogo375.png';
import venuePrimeSm from './assets/venusPrimeLogo640.png';
import venuePrimeMd from './assets/venusPrimeLogo840.png';
import venuePrimeXl from './assets/venusPrimeLogo1280.png';

const textClassName = cn(
  '[&_h2]:text-[1.5rem] [&_h2]:font-semibold xl:[&_h2]:text-[2rem]',
  '[&_p]:text-grey [&_p]:text-[1rem] xl:[&_p]:text-[1.125rem]',
);

export const VenusPrime: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <div className={cn('mt-15 md:mt-20 xl:mt-25', textClassName)}>
      <div
        className={cn(
          'relative overflow-hidden flex border border-solid border-lightGrey rounded-3xl bg-[#1E2431] p-6 sm:h-100',
        )}
      >
        <div className="absolute sm:top-0 sm:-left-1 md:top-2 md:left-0 xl:-top-0.5 xl:-left-1.5">
          <img
            loading="lazy"
            className="hidden max-sm:flex h-50"
            src={venuePrimeXs}
            alt={t('landing.venusPrime.imageAlt')}
          />
          <img
            loading="lazy"
            className="hidden sm:max-md:flex h-100"
            src={venuePrimeSm}
            alt={t('landing.venusPrime.imageAlt')}
          />
          <img
            loading="lazy"
            className="hidden md:max-xl:flex h-100"
            src={venuePrimeMd}
            alt={t('landing.venusPrime.imageAlt')}
          />
          <img
            loading="lazy"
            className="hidden xl:flex h-100"
            src={venuePrimeXl}
            alt={t('landing.venusPrime.imageAlt')}
          />
        </div>
        <div className={cn('flex flex-col', 'max-md:mt-50 sm:ms-60 md:ms-105 xl:ms-147.5')}>
          <h2 className="m-0 mt-7.5 mb-6">
            <Trans
              i18nKey="landing.venusPrime.title"
              components={{
                hl: (
                  <span className="bg-linear-to-t from-[#8E6150] to-[#F2E3DB] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-[#8E6150]" />
                ),
                br: <br />,
              }}
            />
          </h2>
          <p className="m-0 mb-10">{t('landing.venusPrime.text')}</p>

          <ButtonWrapper asChild>
            <Link className="w-fit" href="https://docs-v4.venus.io/whats-new/prime-yield" noStyle>
              {t('landing.venusPrime.learnMore')}
            </Link>
          </ButtonWrapper>
        </div>
      </div>
    </div>
  );
};
