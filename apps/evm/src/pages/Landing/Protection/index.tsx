import { cn } from 'components';
import { useTranslation } from 'libs/translations';
import bugBountyImg from './assets/bugBounty.png';
import protectionImg from './assets/protection.png';

interface IProtectionProps {
  className?: string;
}

const itemClassName = cn(
  'relative flex flex-1 flex-col min-h-105 justify-between p-6 pb-0 border border-solid border-lightGrey rounded-3xl sm:min-h-100 xl:min-h-139 xl:p-10 xl:pb-0',
);

const bgImgClassName = cn('w-full bottom-0');

const textClassName = cn(
  '[&_h2]:text-[1.5rem] [&_h2]:font-semibold xl:[&_h2]:text-[2rem]',
  '[&_p]:text-grey [&_p]:text-[1rem] xl:[&_p]:text-[1.125rem]',
);

export const Protection: React.FC<IProtectionProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('mt-15 md:mt-20 lg:mt-25', textClassName, className)}>
      <ul className={'flex flex-col justify-between gap-6 sm:flex-row xl:gap-8'}>
        <li
          className={cn(
            itemClassName,
            'bg-radial-[62.14%_57.90%_at_50.00%_50.00%,rgba(23,46,98,0.50)_0%,rgba(18,22,32,0.50)_100%]',
          )}
        >
          <div className={'xl:mb-21'}>
            <h2 className="mb-4">{t('landing.protection.challengeTitle')}</h2>
            <p className="mb-8 md:mb-0">{t('landing.protection.challengeText')}</p>
          </div>
          <img
            loading="lazy"
            className={bgImgClassName}
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
          <div className={'xl:mb-21'}>
            <h2 className="mb-4">{t('landing.protection.protectionTitle')}</h2>
            <p className="mb-8 md:mb-0">{t('landing.protection.protectionText')}</p>
          </div>
          <img
            loading="lazy"
            className={bgImgClassName}
            src={protectionImg}
            alt={t('landing.protection.protectionAlt')}
          />
        </li>
      </ul>
    </div>
  );
};
