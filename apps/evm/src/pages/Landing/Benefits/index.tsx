import { useTranslation } from 'libs/translations';
import { DarkBlueCard } from '../Safety/DarkBlueCard';
import Octahedron from './assets/1.svg?react';
import Shield from './assets/2.svg?react';
import Dots from './assets/3.svg?react';

export interface BenefitsProps {
  className?: string;
}

export const Benefits: React.FC<BenefitsProps> = ({ className }) => {
  const { t } = useTranslation();

  const content = [
    {
      Icon: Octahedron,
      title: t('landing.benefits.title1'),
      text: t('landing.benefits.text1'),
    },
    {
      Icon: Shield,
      title: t('landing.benefits.title2'),
      text: t('landing.benefits.text2'),
    },
    {
      Icon: Dots,
      title: t('landing.benefits.title3'),
      text: t('landing.benefits.text3'),
    },
  ];

  return (
    <div className={className}>
      <ul className="flex flex-col gap-3 sm:gap-6 lg:flex-row">
        {content.map(({ Icon, title, text }) => (
          <DarkBlueCard asChild className="p-6 flex gap-x-3 lg:flex-col" key={text}>
            <li>
              <Icon className="size-12 shrink-0 lg:mb-15 xl:mb-23" />

              <div>
                <h3 className="text-p3s lg:text-p2s lg:mb-3">{title}</h3>

                <p className="text-b1r text-light-grey lg:text-p3r">{text}</p>
              </div>
            </li>
          </DarkBlueCard>
        ))}
      </ul>
    </div>
  );
};
