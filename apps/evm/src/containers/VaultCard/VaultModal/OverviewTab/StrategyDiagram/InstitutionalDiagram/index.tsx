import { cn } from 'components';
import { useTranslation } from 'libs/translations';
import type { InstitutionalVault } from 'types';
import { FlowArrow } from '../FlowArrow';
import { FlowNode } from '../FlowNode';

interface InstitutionalDiagramProps {
  vault: InstitutionalVault;
}

export const InstitutionalDiagram: React.FC<InstitutionalDiagramProps> = ({ vault }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col items-stretch')}>
      <p className="text-p2s text-white flex-1 pb-6">
        {t('vault.modals.overview.strategyAllocation')}
      </p>

      <FlowNode variant="line">{t('vault.modals.overview.strategy.users')}</FlowNode>

      <FlowArrow leftContent="CEFFU" rightContent={vault.stakedToken.symbol} />

      <FlowNode variant="primary">{t('vault.modals.overview.strategy.venusVault')}</FlowNode>

      <FlowArrow
        leftContent={t('vault.modals.overview.strategy.loan')}
        rightContent={vault.stakedToken.symbol}
      />

      <FlowNode variant="line">CEFFU</FlowNode>
    </div>
  );
};
