import { useGetYieldPlusPositions } from 'hooks/useGetYieldPlusPositions';
import { useAccountAddress } from 'libs/wallet';
import { areTokensEqual } from 'utilities';
import { useTokenPair } from '../useTokenPair';

export const useGetSelectedYieldPlusPosition = () => {
  const { shortToken, longToken } = useTokenPair();
  const { accountAddress } = useAccountAddress();

  const { data: getYieldPositionsData, ...otherProps } = useGetYieldPlusPositions({
    accountAddress,
  });
  const positions = getYieldPositionsData?.positions || [];

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
