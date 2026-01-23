import { Card, type CardProps, cn } from 'components';
import { useTranslation } from 'libs/translations';
import bugBountyImg from './assets/bugBounty.png';
import protectionImg from './assets/protection.png';

interface IProtectionProps {
  className?: string;
}

const ProtectionCard: React.FC<CardProps> = ({ className, ...props }) => (
  <Card
    className={cn(
      'relative flex md:flex-1 overflow-hidden flex-col h-87.5 justify-between p-6 lg:px-10 pb-0 md:h-112.5 lg:h-139 xl:p-10 xl:pb-0',
      className,
    )}
    {...props}
  />
);

export const Protection: React.FC<IProtectionProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col justify-between gap-6 md:flex-row', className)}>
      <ProtectionCard
        className={
          'bg-radial-[62.14%_57.90%_at_50.00%_50.00%,rgba(23,46,98,0.50)_0%,rgba(18,22,32,0.50)_100%]'
        }
      >
        <div className={cn('mb-6 lg:mb-12 xl:mb-12 max-sm:text-center')}>
          <h6 className={cn('text-p2s md:text-p1s lg:text-h6', 'mb-3 md:mb-4')}>
            {t('landing.protection.challengeTitle')}
          </h6>
          <p className="text-grey text-b1r lg:text-p3r">{t('landing.protection.challengeText')}</p>
        </div>
        <img
          loading="lazy"
          className={cn('w-full', 'md:mb-12 xl:mb-0 2xl:mb-12')}
          src={bugBountyImg}
          alt={t('landing.protection.bugBountyAlt')}
        />
      </ProtectionCard>
      <ProtectionCard
        className={
          'bg-radial-[62.14%_57.90%_at_50.00%_50.00%,rgba(30,75,100,0.50)_0%,rgba(18,22,32,0.50)_100%]'
        }
      >
        <div className={'xl:mb-2 max-sm:text-center'}>
          <h6 className={cn('text-p2s md:text-p1s lg:text-h6', 'mb-4')}>
            {t('landing.protection.protectionTitle')}
          </h6>
          <p className={cn('text-grey text-b1r lg:text-p3r', 'mb-4 sm:mb-3 md:mb-0')}>
            {t('landing.protection.protectionText')}
          </p>
        </div>
        <img
          loading="lazy"
          className={
            'max-sm:w-full max-sm:pb-8 object-cover object-[0%_50%] md:min-w-[160%] md:pb-8 md:-translate-x-[15%] xl:min-w-[130%] xl:-translate-x-[10%] 2xl:pb-0 2xl:translate-y-5'
          }
          src={protectionImg}
          alt={t('landing.protection.protectionAlt')}
        />
      </ProtectionCard>
    </div>
  );
};
