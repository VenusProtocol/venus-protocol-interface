import { Icon, Spinner, TokenIcon } from 'components';
import { AddTokenToWalletDropdown } from '../../AddTokenToWalletDropdown';
import { GoToTokenContractDropdown } from '../../GoToTokenContractDropdown';
import type { MarketInfoHeaderProps } from '../../types';

export const XsMarketInfoHeader = ({
  asset,
  pool,
  isUserConnected,
  handleGoBack,
}: MarketInfoHeaderProps) => {
  return (
    <div className="px-4 md:px-6 xl:px-10 max-w-[1360px] mx-auto">
      <div className="flex items-center pb-3">
        {asset && pool && (
          <div className="flex w-full justify-between">
            <TokenIcon token={asset.vToken.underlyingToken} className="h-full w-8 shrink-0" />
            <div className="flex gap-[12px]">
              <AddTokenToWalletDropdown isUserConnected={isUserConnected} vToken={asset.vToken} />
              <GoToTokenContractDropdown vToken={asset.vToken} />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1 items-center">
        <button type="button" onClick={handleGoBack} className="h-full flex items-center">
          <Icon name="chevronLeft" className="w-6 h-6 text-offWhite" />
          {(!asset || !pool) && <Spinner className="h-full w-auto" />}
        </button>
        {asset && pool && (
          <span className="text-nowrap font-semibold text-lg">
            {asset.vToken.underlyingToken.symbol} ({pool?.name})
          </span>
        )}
      </div>
    </div>
  );
};
