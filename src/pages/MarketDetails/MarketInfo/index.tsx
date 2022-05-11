/** @jsxImportSource @emotion/react */
import React from 'react';

import { useTranslation } from 'translation';
import Card from '../Card';

const MarketInfo: React.FC = () => {
  const { t } = useTranslation();

  return <Card title={t('marketDetails.marketInfo.title')} />;
};

export default MarketInfo;
