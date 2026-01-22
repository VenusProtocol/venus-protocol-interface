import { cn } from 'components';
import { useTranslation } from 'libs/translations';
import Octahedron from './assets/1.svg?react';
import Shield from './assets/2.svg?react';
import Dots from './assets/3.svg?react';

interface IBenefitsProps {
  className?: string;
}

const iconClassName = cn('mb-[24px] sm:mb-0 sm:me-[24px] md:me-0 md:mb-[85px]');

export const Benefits: React.FC<IBenefitsProps> = ({ className }) => {
  const { t } = useTranslation();

  const content = [
    {
      icon: <Octahedron className={iconClassName} />,
      title: t('landing.benefits.title1'),
      text: t('landing.benefits.text1'),
    },
    {
      icon: <Shield className={iconClassName} />,
      title: t('landing.benefits.title2'),
      text: t('landing.benefits.text2'),
    },
    {
      icon: <Dots className={iconClassName} />,
      title: t('landing.benefits.title3'),
      text: t('landing.benefits.text3'),
    },
  ];

  return (
    <div className={cn('mt-15 md:mt-20 xl:mt-25', className)}>
      <ul className="md:flex md:gap-6">
        {content.map(({ icon, title, text }) => (
          <li
            className={
              'bg-[#1E2431] rounded-lg p-6 border border-solid border-lightGrey mt-4 first:mt-0 sm:flex sm:items-center md:w-1/3 md:flex-col md:items-start md:rounded-3xl md:mt-0'
            }
            key={text}
          >
            {icon}
            <div>
              <h3 className="text-p3s lg:text-p1s m-0 mb-2">{title}</h3>
              <p className="m-0 text-grey">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
