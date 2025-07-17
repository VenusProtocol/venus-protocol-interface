import { Icon, Pill, Spinner, TokenIcon } from 'components';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useTranslation } from 'libs/translations';
import { AddTokenToWalletDropdown } from '../../AddTokenToWalletDropdown';
import { GoToTokenContractDropdown } from '../../GoToTokenContractDropdown';
import type { MarketInfoHeaderProps } from '../../types';

export const SmMarketInfoHeader = ({
  asset,
  pool,
  isUserConnected,
  handleGoBack,
}: MarketInfoHeaderProps) => {
  const { t } = useTranslation();
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  return (
    <div className="flex items-center h-8 px-4 md:px-6 xl:px-10 max-w-[1360px] mx-auto">
      <button type="button" onClick={handleGoBack} className="h-full pr-3 flex items-center">
        <Icon name="chevronLeft" className="w-6 h-6 text-offWhite" />
      </button>

      {asset && pool ? (
        <div className="flex items-center gap-3">
          <TokenIcon token={asset.vToken.underlyingToken} className="h-full w-8 shrink-0" />

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-bold text-lg">
              {asset.vToken.underlyingToken.symbol} ({pool?.name})
            </span>

            {pool.isIsolated && pool.comptrollerAddress !== corePoolComptrollerContractAddress && (
              <Pill>{t('layout.header.isolated')}</Pill>
            )}
          </div>

          <AddTokenToWalletDropdown isUserConnected={isUserConnected} vToken={asset.vToken} />

          <GoToTokenContractDropdown vToken={asset.vToken} />
        </div>
      ) : (
        <Spinner className="h-full w-auto" />
      )}
    </div>
  );
};
