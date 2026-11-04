import { Button, cn } from '@venusprotocol/ui';
import { Dropdown, Icon, InfoIcon, TokenIcon } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import { formatPercentageToReadableValue } from 'utilities';

export interface CollateralSelectProps {
  collaterals: Asset[];
  value: Asset;
  onChange: (collateral: Asset) => void;
}

export const CollateralSelect: React.FC<CollateralSelectProps> = ({
  collaterals,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const isMdOrUp = useBreakpointUp('md');

  return (
    <Dropdown
      menuTitle={isMdOrUp ? undefined : t('lite.collateralSelect.title')}
      menuClassName="w-max min-w-80 overflow-hidden"
      optionsDom={({ setIsDropdownOpen }) => (
        <div className="min-w-full md:pt-3">
          {isMdOrUp && (
            <p className="px-4 pb-3 text-b1s text-white">{t('lite.collateralSelect.title')}</p>
          )}

          <div className="grid grid-cols-[1fr_5rem_5rem] items-center gap-x-3 px-4 pb-2 text-b1r text-light-grey">
            <span>{t('lite.collateralSelect.asset')}</span>

            <span className="inline-flex items-center justify-end gap-x-1">
              {t('lite.collateralSelect.maxLtv')}
              <InfoIcon tooltip={t('lite.collateralSelect.maxLtvTooltip')} />
            </span>

            <span className="inline-flex items-center justify-end gap-x-1">
              {t('lite.collateralSelect.liquidationThreshold')}
              <InfoIcon tooltip={t('lite.collateralSelect.liquidationThresholdTooltip')} />
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {collaterals.map(collateral => {
              const isSelected = collateral.vToken.address === value.vToken.address;

              return (
                <button
                  key={collateral.vToken.address}
                  type="button"
                  onClick={() => {
                    onChange(collateral);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    'grid w-full cursor-pointer grid-cols-[1fr_5rem_5rem] items-center gap-x-3 px-4 py-3 text-left text-b1r tabular-nums hover:bg-background-hover',
                    isSelected && 'bg-background-hover',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-x-2">
                    <TokenIcon token={collateral.vToken.underlyingToken} />
                    <span className="truncate">{collateral.vToken.underlyingToken.symbol}</span>
                  </span>

                  <span className="text-right">
                    {formatPercentageToReadableValue(collateral.collateralFactor * 100)}
                  </span>

                  <span className="flex items-center justify-end gap-x-1">
                    {formatPercentageToReadableValue(collateral.liquidationThresholdPercentage)}
                    <Icon
                      name="mark"
                      className={cn('size-4 shrink-0 text-green', !isSelected && 'invisible')}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    >
      {({ isDropdownOpen, handleToggleDropdown }) => (
        <Button
          variant="secondary"
          aria-label={t('lite.collateralSelect.ariaLabel')}
          onClick={handleToggleDropdown}
          className={cn('h-9 px-3', isDropdownOpen && 'border-blue')}
          contentClassName="gap-x-2 text-b1s"
        >
          <TokenIcon token={value.vToken.underlyingToken} />
          <span>{value.vToken.underlyingToken.symbol}</span>
          <Icon
            name="chevronDown"
            className={cn('size-3 text-grey', isDropdownOpen && 'rotate-180')}
          />
        </Button>
      )}
    </Dropdown>
  );
};
