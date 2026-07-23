import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { Spinner } from 'components';
import type { LiquidityHub, VhToken } from 'types';
import { areTokensEqual } from 'utilities';

export interface LiquidityHubAccessorProps {
  vhToken: VhToken;
  children: (props: { liquidityHub: LiquidityHub }) => React.ReactNode;
}

const LiquidityHubAccessor: React.FC<LiquidityHubAccessorProps> = ({ vhToken, children }) => {
  // TODO: fetch from API
  const liquidityHub = liquidityHubs.find(liquidityHub =>
    areTokensEqual(vhToken, liquidityHub.vhToken),
  );

  if (!liquidityHub) {
    return <Spinner />;
  }

  return children({ liquidityHub });
};

export default LiquidityHubAccessor;
