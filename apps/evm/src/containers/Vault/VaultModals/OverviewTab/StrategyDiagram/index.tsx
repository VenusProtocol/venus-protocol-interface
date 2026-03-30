import { cn } from 'components';
import { useTranslation } from 'libs/translations';
import type { PendleVault } from 'types';
import { FlowArrow } from './FlowArrow';
import { FlowNode } from './FlowNode';

interface StrategyDiagramProps {
  vault: PendleVault;
}

export const StrategyDiagram: React.FC<StrategyDiagramProps> = ({ vault }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col items-stretch')}>
      <FlowNode variant="line">{t('vault.modals.overview.strategy.users')}</FlowNode>

      <FlowArrow
        leftContent={vault.manager.toUpperCase()}
        rightContent={vault.rewardToken.symbol}
      />

      <FlowNode variant="primary">{t('vault.modals.overview.strategy.pendleRouter')}</FlowNode>
      <FlowArrow
        leftContent={t('vault.modals.overview.supply', 'Supply')}
        rightContent={vault.stakedToken.symbol}
      />

      <FlowNode variant="line">
        {t('vault.modals.overview.strategy.supply')} {t('vault.modals.overview.strategy.venusCore')}
      </FlowNode>
    </div>
  );
};
