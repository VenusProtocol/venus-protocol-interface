import { useMemo } from 'react';

import { useGetVTokens } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { findTokenByAddress } from 'utilities';

export interface VTokenSymbolProps {
  vTokenAddress?: string;
}

const VTokenSymbol: React.FC<VTokenSymbolProps> = ({ vTokenAddress }) => {
  const { data: getVTokensData } = useGetVTokens();

  const vToken = useMemo(
    () =>
      vTokenAddress
        ? findTokenByAddress({
            tokens: getVTokensData?.vTokens || [],
            address: vTokenAddress,
          })
        : undefined,
    [vTokenAddress, getVTokensData],
  );

  return (
    <div className="inline-flex items-center">
      <span>{vToken?.underlyingToken.symbol || PLACEHOLDER_KEY}</span>
    </div>
  );
};

export default VTokenSymbol;
