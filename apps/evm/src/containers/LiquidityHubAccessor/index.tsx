import { useGetLiquidityHub } from 'clients/api';
import { NoticeWarning, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { LiquidityHub, VhToken } from 'types';

export interface LiquidityHubAccessorProps {
  vhToken: VhToken;
  children: (props: { liquidityHub: LiquidityHub }) => React.ReactNode;
}

const LiquidityHubAccessor: React.FC<LiquidityHubAccessorProps> = ({ vhToken, children }) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();

  const { data: getLiquidityHubData } = useGetLiquidityHub({
    vhTokenAddress: vhToken.address,
    accountAddress,
  });
  const liquidityHub = getLiquidityHubData?.liquidityHub;

  if (!liquidityHub) {
    return <Spinner />;
  }

  if (liquidityHub.isPaused) {
    return <NoticeWarning description={t('contractErrors.actionPaused')} />;
  }

  return children({ liquidityHub });
};

export default LiquidityHubAccessor;
