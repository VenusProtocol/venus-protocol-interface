import { cn } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { DarkBlueCard } from '../DarkBlueCard';
import circleBackgroundSrc from './assets/circleBackground.svg';

interface ISafetyProps {
  className?: string;
}

export const SafetyScore: React.FC<ISafetyProps> = ({ className }) => {
  const { t, Trans } = useTranslation();

  return (
    <DarkBlueCard
      className={cn('relative flex flex-col items-center p-6 shrink-0 sm:py-8', className)}
    >
      <div className="relative w-full max-w-122 mx-auto flex flex-col justify-center items-center gap-6 sm:flex-row xl:flex-col">
        <div className="relative flex flex-col shrink-0 justify-center items-center size-38 sm:size-35 xl:size-45">
          <p className="text-h4 leading-none">94</p>

          <span className="text-b2r">{t('landing.safety.securityScore')}</span>

          <img
            loading="lazy"
            className="absolute"
            src={circleBackgroundSrc}
            alt={t('landing.safety.scoreAlt')}
          />
        </div>

        <p className="text-b1r text-center">
          <Trans
            i18nKey="landing.safety.venusScored"
            components={{
              Link: <Link href="https://skynet.certik.com/projects/venus" />,
            }}
          />
        </p>
      </div>
    </DarkBlueCard>
  );
};
