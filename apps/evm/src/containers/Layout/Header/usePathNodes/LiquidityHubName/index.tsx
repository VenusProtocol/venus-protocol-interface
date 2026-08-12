import type { Address } from 'viem';

import { useGetLiquidityHub } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useAccountAddress } from 'libs/wallet';

export interface LiquidityHubNameProps {
  vhTokenAddress?: Address;
}

const LiquidityHubName: React.FC<LiquidityHubNameProps> = ({ vhTokenAddress }) => {
  const { accountAddress } = useAccountAddress();

  const { data: getLiquidityHubData } = useGetLiquidityHub(
    {
      vhTokenAddress: vhTokenAddress || NULL_ADDRESS,
      accountAddress,
    },
    {
      enabled: !!vhTokenAddress,
    },
  );
  const liquidityHub = getLiquidityHubData?.liquidityHub;

  return (
    <div className="inline-flex items-center">
      <span>{liquidityHub?.vhToken.underlyingToken.symbol || PLACEHOLDER_KEY}</span>
    </div>
  );
};

export default LiquidityHubName;
