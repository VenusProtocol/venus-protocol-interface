/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTranslation } from 'translation';
import { Vault } from 'types';

import Section from '../Section';
import Table from './Table';

export interface VaultsBreakdownProps {
  vaults: Vault[];
  className?: string;
}

export const VaultsBreakdown: React.FC<VaultsBreakdownProps> = ({ vaults, className }) => {
  const { t } = useTranslation();

  return (
    <Section className={className} title={t('account.vaultsBreakdown.title')}>
      <Table vaults={vaults} />
    </Section>
  );
};

export default VaultsBreakdown;
