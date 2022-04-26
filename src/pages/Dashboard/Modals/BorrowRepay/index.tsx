/** @jsxImportSource @emotion/react */
import React from 'react';

import { Asset } from 'types';
import { Tabs } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../styles';
import Borrow from './Borrow';

export interface IBorrowRepayProps {
  asset: Asset;
  className?: string;
}

const BorrowRepay: React.FC<IBorrowRepayProps> = ({ className, asset }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const tabsContent = [
    { title: t('borrowRepayModal.borrowTabTitle'), content: <Borrow asset={asset} /> },
    { title: t('borrowRepayModal.repayTabTitle'), content: <></> },
  ];

  return (
    <div className={className} css={styles.container}>
      <Tabs tabsContent={tabsContent} />
    </div>
  );
};

export default BorrowRepay;
