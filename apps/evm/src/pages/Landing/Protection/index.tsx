import { cn } from 'components';
import { useTranslation } from 'libs/translations';
import bugBountyImg from './assets/bugBounty.png';
import protectionImg from './assets/protection.png';

interface IProtectionProps {
  className?: string;
}

const itemClassName = cn(
  'relative flex md:flex-1 overflow-hidden flex-col h-87.5 justify-between p-6 pb-0 border border-solid border-lightGrey rounded-3xl md:h-112.5 lg:h-139 xl:p-10 xl:pb-0',
);

const textClassName = cn(
  '[&_h6]:text-p2s [&_h6]:md:text-p1s [&_h6]:lg:text-h6',
  '[&_p]:text-grey [&_p]:text-b1r [&_p]:lg:text-p3r',
);

export const Protection: React.FC<IProtectionProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('mt-15 md:mt-20 lg:mt-25', textClassName, className)}>
      <ul className={'flex flex-col justify-between gap-6 md:flex-row xl:gap-8'}>
        <li
          className={cn(
            itemClassName,
            'bg-radial-[62.14%_57.90%_at_50.00%_50.00%,rgba(23,46,98,0.50)_0%,rgba(18,22,32,0.50)_100%]',
          )}
        >
          <div className={'mb-6 xl:mb-12'}>
            <h6 className="mb-4">{t('landing.protection.challengeTitle')}</h6>
            <p className="mb-8 md:mb-0">{t('landing.protection.challengeText')}</p>
          </div>
          <img
            loading="lazy"
            className={'w-full'}
            src={bugBountyImg}
            alt={t('landing.protection.bugBountyAlt')}
          />
        </li>
        <li
          className={cn(
            itemClassName,
            'bg-radial-[62.14%_57.90%_at_50.00%_50.00%,rgba(30,75,100,0.50)_0%,rgba(18,22,32,0.50)_100%]',
          )}
        >
          <div className={'xl:mb-2'}>
            <h6 className="mb-4">{t('landing.protection.protectionTitle')}</h6>
            <p className="mb-4 sm:mb-3 md:mb-0">{t('landing.protection.protectionText')}</p>
          </div>
          <img
            loading="lazy"
            className={
              'max-sm:w-full max-sm:pb-8 object-cover object-[0%_50%] md:min-w-[160%] md:pb-8 md:-translate-x-[15%] xl:min-w-[130%] xl:-translate-x-[10%]'
            }
            src={protectionImg}
            alt={t('landing.protection.protectionAlt')}
          />
        </li>
      </ul>
    </div>
  );
};
