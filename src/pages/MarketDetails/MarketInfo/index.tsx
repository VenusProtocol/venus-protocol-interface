/** @jsxImportSource @emotion/react */
import React from 'react';

import { useTranslation } from 'translation';
import Card from '../Card';

const MarketDetails: React.FC = () => {
  const { t } = useTranslation();

  return <Card title={t('marketDetails.marketInfoTitle')} />;
};

export default MarketDetails;
