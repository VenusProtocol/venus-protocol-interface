import { Asset, VTokenId } from 'types';
import { useGetVTokenBalance, useRedeem, useRedeemUnderlying } from 'clients/api';

export interface UseWithdrawParams {
  amount: string;
}

const useWithdraw = ({ account, asset }: { account: string | undefined; asset: Asset }) => {
  const { data: vTokenBalance } = useGetVTokenBalance(
    { account, assetId: asset.id as VTokenId },
    { enabled: !!account },
  );
  const { mutate: redeem, isLoading: isRedeemLoading } = useRedeem({
    assetId: asset?.id as VTokenId,
    account,
  });
  const { mutate: redeemUnderlying, isLoading: isRedeemUnderlyingLoading } = useRedeemUnderlying({
    assetId: asset?.id as VTokenId,
    account,
  });
  return {
    redeem,
    redeemUnderlying,
    isLoading: isRedeemLoading || isRedeemUnderlyingLoading,
    vTokenBalance,
  };
};

export default useWithdraw;
