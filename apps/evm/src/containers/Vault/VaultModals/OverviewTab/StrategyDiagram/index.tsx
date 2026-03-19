import { cn } from 'components';
import { useTranslation } from 'libs/translations';
import type { AnyVault } from 'types';
import { FlowArrow } from './FlowArrow';
import { FlowNode } from './FlowNode';

interface StrategyDiagramProps {
  vault: AnyVault;
}

export const StrategyDiagram: React.FC<StrategyDiagramProps> = ({ vault }) => {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col items-stretch')}>
      <FlowNode variant="line">{t('vaultModals.overview.strategy.users')}</FlowNode>

      <FlowArrow
        leftContent={vault.manager.toUpperCase()}
        rightContent={vault.rewardToken.symbol}
      />

      <FlowNode variant="primary">{t('vaultModals.overview.strategy.pendleRouter')}</FlowNode>
      <FlowArrow
        leftContent={t('vaultModals.overview.supply', 'Supply')}
        rightContent={vault.stakedToken.symbol}
      />

      <FlowNode variant="line">
        {t('vaultModals.overview.strategy.supply')} {t('vaultModals.overview.strategy.venusCore')}
      </FlowNode>
    </div>
  );
};
