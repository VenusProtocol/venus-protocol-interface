import { ButtonWrapper, Card, cn } from 'components';

import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import venuePrimeBg from './assets/venusPrimeBg.svg';
import venusPrimeIllus from './assets/venusPrimeIllus.png';

const PRIME_YIELD_DOC_URL = `${VENUS_DOC_URL}/prime-yield`;

export const VenusPrime: React.FC = () => {
  const { t, Trans } = useTranslation();

  return (
    <Card className="relative overflow-hidden flex h-112.5 p-0 sm:h-87.5 md:h-100">
      <div className="absolute top-0 bottom-0 start-0 end-0">
        <img
          loading="lazy"
          className={cn('absolute w-full h-full object-cover object-[30%_50%]')}
          src={venuePrimeBg}
          role="img"
          alt={t('landing.venusPrime.imageAlt')}
        />
      </div>

      <div
        className={cn(
          'relative flex flex-col w-full p-6 z-10 lg:p-10 items-center max-sm:text-center sm:items-start sm:justify-center',
        )}
      >
        <img
          loading="lazy"
          className={cn(
            'absolute object-contain -bottom-11 h-61.5 -ml-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:ml-0 sm:bottom-0 sm:-right-17 sm:h-84.5 md:h-94 md:-right-15 lg:h-100 lg:-right-10 xl:right-0 2xl:right-20',
          )}
          src={venusPrimeIllus}
          alt={t('landing.venusPrime.imageAlt')}
        />

        <div className="sm:max-w-1/2 xl:max-w-[40%] 2xl:max-w-[35%]">
          <h6 className="text-p2s md:text-p1s lg:text-h6">
            <Trans
              i18nKey="landing.venusPrime.title"
              components={{
                hl: (
                  <span className="bg-linear-to-b from-[#A87E6D] to-[#FFDDCB] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-[#A87E6D]" />
                ),
                br: <br />,
              }}
            />
          </h6>

          <p className="text-light-grey mt-3 text-b1r lg:text-p3r">
            {t('landing.venusPrime.text')}
          </p>

          <ButtonWrapper asChild className="mt-6 sm:mt-10" size={'sm'}>
            <Link className="w-fit" href={PRIME_YIELD_DOC_URL} noStyle>
              {t('landing.venusPrime.learnMore')}
            </Link>
          </ButtonWrapper>
        </div>
      </div>
    </Card>
  );
};
