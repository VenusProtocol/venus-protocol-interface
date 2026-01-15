import { cn } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import scoreImg from './assets/score.svg';
import Score90 from './assets/score90.svg?react';
interface ISafetyProps {
  className?: string;
}

export const SafetyScore: React.FC<ISafetyProps> = ({ className }) => {
  const { t, Trans } = useTranslation();

  return (
    <div
      className={cn(
        'relative flex flex-col items-center bg-[#1E2431] rounded-3xl p-6 md:px-12 xl:w-93.75 xl:p-6 xl:pb-4',
        className,
      )}
    >
      <div className="relative w-full max-w-145 mx-auto flex flex-col justify-center items-center gap-6 sm:flex-row xl:flex-col">
        <div className="relative flex flex-col justify-center items-center h-35 w-55 text-center xl:h-45 xl:w-45">
          <Score90 />
          <span className="text-grey text-center text-[0.625rem] font-normal leading-4.5 mt-1.5 no-underline">
            {t('landing.safety.securityScore')}
          </span>
          <img
            loading="lazy"
            className="absolute"
            src={scoreImg}
            alt={t('landing.safety.scoreAlt')}
          />
        </div>

        <p className="m-0 text-base text-grey leading-6 text-center sm:text-left xl:text-[0.875rem] xl:text-center">
          <Trans
            i18nKey="landing.safety.venusScored"
            components={{
              Link: <Link href="https://skynet.certik.com/projects/venus" />,
            }}
          />
        </p>
      </div>
    </div>
  );
};
