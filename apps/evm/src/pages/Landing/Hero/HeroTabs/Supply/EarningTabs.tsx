import { ButtonGroup } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import { formatCentsToReadableValue } from 'utilities';
import { BASE_AMOUNT } from '../shared';

const rowClassName = 'flex justify-between w-full items-center text-white text-b1r pt-3';

type EarningTabsProps = {
  data: { month: number; cumAmount: number; currAmount: number }[];
};

export const EarningTabs: React.FC<EarningTabsProps> = ({ data }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(1);
  const tabs = [
    {
      title: t('landing.hero.30Day'),
      id: 1,
    },
    {
      title: t('landing.hero.6Month'),
      id: 6,
    },
    {
      title: t('landing.hero.1Year'),
      id: 12,
    },
  ];

  const handleChange = (index: number) => {
    const id = tabs[index].id;
    setActiveTab(id);
  };

  const len = data?.length;

  const displayData = {
    ...data[activeTab - 1],
    yearlyEarning: data[len - 1]?.cumAmount - BASE_AMOUNT,
  };

  return (
    <div className="mt-6">
      <ButtonGroup
        buttonLabels={tabs.map(({ title }) => title)}
        activeButtonIndex={tabs.findIndex(tab => activeTab === tab.id)}
        onButtonClick={handleChange}
        fullWidth
        className="bg-dark-blue-active gap-x-0 rounded-lg mb-3"
        buttonClassName="h-12 m-0!"
        // activeClassName="bg-blue hover:bg-blue-hover!"
      />
      {len > 0 && (
        <>
          <div className={rowClassName}>
            <div>{t('landing.hero.assets')}</div>
            <div className="text-b1s text-end">
              {formatCentsToReadableValue({
                value: displayData.cumAmount * 100,
              })}
            </div>
          </div>
          <div className={rowClassName}>
            <div>{t('landing.hero.earned')}</div>
            <div className="text-b1s text-end">
              {formatCentsToReadableValue({
                value: displayData.currAmount * 100,
              })}
            </div>
          </div>
          <div className={rowClassName}>
            <div>{t('landing.hero.yearlyEarnings')}</div>
            <div className="text-b1s text-end">
              {formatCentsToReadableValue({
                value: displayData.yearlyEarning * 100,
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
