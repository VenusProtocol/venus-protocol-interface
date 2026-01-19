import { useProposalsCount } from 'clients/api/queries/getProposalsCount/useGetProposalsCount';
import { ButtonWrapper, cn } from 'components';
import { COMMUNITY_URL } from 'constants/production';
import { useTranslation } from 'libs/translations';
import planetsImg from './assets/planets.png';

const textClassName = cn(
  '[&_h2]:text-[1.5rem] [&_h2]:font-semibold xl:[&_h2]:text-[2rem]',
  '[&_p]:text-grey [&_p]:text-[1rem] xl:[&_p]:text-[1.125rem]',
);

export const Governance: React.FC = () => {
  const { t, Trans } = useTranslation();
  const { data: proposalsCount, isLoading } = useProposalsCount();

  return !isLoading && proposalsCount ? (
    <div className={cn('mt-15 md:mt-20 xl:mt-25', textClassName)}>
      <div
        className={
          'flex flex-col-reverse justify-between overflow-y-hidden border border-solid border-lightGrey rounded-3xl h-135.5 bg-[#1E2431] sm:h-94 sm:flex-row xl:gap-6 xl:h-125'
        }
      >
        <div
          className={
            'flex flex-col justify-evenly flex-1 pt-6 ps-6 h-full sm:max-w-1/2 md:max-w-81.25 xl:max-w-1/2 xl:pe-8 xl:ps-10'
          }
        >
          <div>
            <h2 className="mb-4 xl:mb-6 xl:pt-4 xl:pe-6.75 xl:pl-0 xl:ps-10">
              <Trans
                i18nKey="landing.governance.title"
                components={{
                  br: <br />,
                }}
              />
            </h2>
            <p className="mt-4 mb-10 md:text-[1rem] xl:text-[1.125rem]">
              {t('landing.governance.text')}
            </p>
            <ButtonWrapper asChild>
              <a className={'w-fit mb-6'} href={COMMUNITY_URL}>
                {t('landing.governance.forum')}
              </a>
            </ButtonWrapper>
          </div>
        </div>
        <div
          className={
            'relative flex flex-col justify-center items-center min-h-62.5 bg-position-[center,-100px] bg-no-repeat bg-size-[352px] sm:bg-position-[-5px] sm:w-73.75 sm:max-w-110 sm:bg-size-[360px] sm:[background-position-x:35px] md:w-108 md:max-w-108 md:ps-13 md:bg-size-[445px] md:[background-position-x:27px] md:[background-position-y:-34px] xl:ms-0 xl:ps-2.5 xl:w-147.5 xl:max-w-147.5 xl:bg-size-[605px] xl:bg-position-center xl:[background-position-x-0] overflow-hidden'
          }
        >
          <img
            loading="lazy"
            className="absolute h-88 -top-25 sm:-right-24 sm:top-0 sm:h-90 max-w-[unset] md:h-111.25 md:-top-8 md:-right-7 lg:-right-9.5 xl:h-151.25 xl:left-0 xl:-top-13"
            src={planetsImg}
            alt={t('landing.governance.planetsAlt')}
          />
          <div
            className={
              'absolute top-[50%] -translate-y-full flex flex-col sm:end-0 sm:me-3.5 sm:translate-y-[-50%] md:me-0 md:end-[unset] lg:ms-7.5 lg:me-3.5 xl:ms-4.5'
            }
          >
            <span
              className={
                'font-bebas-neue font-semibold text-[2.5rem] text-center tracking-[3.933px] lg:text-[3.5rem] xl:text-[4rem]'
              }
            >
              {proposalsCount}
            </span>
            <span
              className={
                'text-grey text-center text-[0.875rem] max-w-32.5 sm:text-[0.75rem] leading-4.5 lg:text-[1rem] lg:[font-variant-caps:all-small-caps] lg:tracking-[0.07rem] lg:leading-5.25 lg:max-w-57.5 xl:text-[1rem] xl:tracking-[0.07rem] xl:max-w-78'
              }
            >
              {t('landing.governance.proposalCounting')}
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
