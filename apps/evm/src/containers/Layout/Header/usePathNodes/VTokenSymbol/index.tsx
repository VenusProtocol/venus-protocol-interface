import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { useGetVTokens } from 'libs/tokens/hooks/useGetVTokens';
import { findTokenByAddress } from 'utilities';

export interface VTokenSymbolProps {
  vTokenAddress?: string;
}

const VTokenSymbol: React.FC<VTokenSymbolProps> = ({ vTokenAddress }) => {
  const vTokens = useGetVTokens();
  const vToken = vTokenAddress
    ? findTokenByAddress({
        tokens: vTokens,
        address: vTokenAddress,
      })
    : undefined;

  return (
    <div className="inline-flex items-center">
      <span>{vToken?.underlyingToken.symbol || PLACEHOLDER_KEY}</span>
    </div>
  );
};

export default VTokenSymbol;
