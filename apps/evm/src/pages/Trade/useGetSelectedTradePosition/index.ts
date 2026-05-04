import { useGetTradePositions } from 'hooks/useGetTradePositions';
import { useAccountAddress } from 'libs/wallet';
import { areTokensEqual } from 'utilities';
import { useTokenPair } from '../useTokenPair';

export const useGetSelectedTradePosition = () => {
  const { shortToken, longToken } = useTokenPair();
  const { accountAddress } = useAccountAddress();

  const { data: getTradeData, ...otherProps } = useGetTradePositions({
    accountAddress,
  });
  const positions = getTradeData?.positions || [];

  const position = positions.find(
    position =>
      areTokensEqual(position.longAsset.vToken.underlyingToken, longToken) &&
      areTokensEqual(position.shortAsset.vToken.underlyingToken, shortToken),
  );

  return {
    data: position ? { position } : undefined,
    ...otherProps,
  };
};
