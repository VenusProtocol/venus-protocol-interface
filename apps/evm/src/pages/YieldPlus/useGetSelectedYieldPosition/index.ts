import { useGetYieldPlusPositions } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useAccountAddress } from 'libs/wallet';
import { areTokensEqual } from 'utilities';
import { useTokenPair } from '../useTokenPair';

export const useGetSelectedYieldPosition = () => {
  const { shortToken, longToken } = useTokenPair();
  const { accountAddress } = useAccountAddress();

  const { data: getYieldPositionsData, ...otherProps } = useGetYieldPlusPositions(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );
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
