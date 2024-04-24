import { AssetWarning, Card } from 'components';
import type { Asset, Pool } from 'types';

export interface MarketProps {
  asset: Asset;
  pool: Pool;
}

export const Market: React.FC<MarketProps> = ({ asset, pool }) => {
  return (
    <div className="py-6 md:py-8 xl:py-12">
      <AssetWarning
        token={asset.vToken.underlyingToken}
        pool={pool}
        type="supply"
        className="mb-4 sm:mb-6"
      />

      <div className="space-y-6 lg:flex lg:space-y-0 lg:gap-x-6">
        <Card className="h-[300px] lg:order-2 lg:sticky lg:top-6 w-auto lg:w-[400px]">
          Supply/Borrow/Withdraw/Repay form
        </Card>

        <div className="space-y-6 lg:grow lg:order-1">
          <Card className="h-[300px]">Supply info</Card>

          <Card className="h-[300px]">Borrow info</Card>

          <Card className="h-[300px]">Market info</Card>
        </div>
      </div>
    </div>
  );
};
