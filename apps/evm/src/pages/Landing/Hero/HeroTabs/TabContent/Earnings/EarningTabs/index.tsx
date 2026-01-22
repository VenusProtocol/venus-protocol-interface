import { cn } from '@venusprotocol/ui';
import { useState } from 'react';

import { ButtonGroup } from 'components';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { Row } from '../../../Row';
import type { CompoundedAmountDataPoint } from '../../types';

interface Period {
  label: string;
  value: number;
}

export interface EarningTabsProps {
  data: CompoundedAmountDataPoint[];
  className?: string;
}

export const EarningTabs: React.FC<EarningTabsProps> = ({ data, className }) => {
  const { t } = useTranslation();

  const periodOptions: Period[] = [
    {
      label: t('landing.hero.30Day'),
      value: 1,
    },
    {
      label: t('landing.hero.6Month'),
      value: 6,
    },
    {
      label: t('landing.hero.1Year'),
      value: 12,
    },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState<Period>(periodOptions[0]);

  const handleChange = (index: number) => setSelectedPeriod(periodOptions[index]);

  const displayData = data[selectedPeriod.value - 1];

  const dataRows: {
    label: string;
    content: string;
  }[] = [
    {
      label: t('landing.hero.assets'),
      content: formatCentsToReadableValue({
        value: displayData.amountCents,
        shorten: false,
      }),
    },
    {
      label: t('landing.hero.earned'),
      content: formatCentsToReadableValue({
        value: displayData.earningsCents,
        shorten: false,
      }),
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <ButtonGroup
        buttonLabels={periodOptions.map(({ label }) => label)}
        activeButtonIndex={periodOptions.findIndex(tab => selectedPeriod.value === tab.value)}
        onButtonClick={handleChange}
        fullWidth
        buttonSize="sm"
      />

      {data?.length > 0 && (
        <div className="space-y-3">
          {dataRows.map(dataRow => (
            <Row key={dataRow.label}>
              <p className="text-b1r">{dataRow.label}</p>

              <p className="text-b1s">{dataRow.content}</p>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
};
