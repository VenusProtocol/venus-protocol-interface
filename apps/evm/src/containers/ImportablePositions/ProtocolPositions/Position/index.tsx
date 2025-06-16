import { cn } from '@venusprotocol/ui';
import { useImportSupplyPosition } from 'clients/api';
import { Apy, Button, Delimiter, Icon, TokenIcon } from 'components';
import { SwitchChain } from 'containers/SwitchChain';
import type { ProfitableSupplyPosition } from 'hooks/useGetProfitableImports';
import { useTranslation } from 'libs/translations';
import {
  calculateYearlyInterests,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { ApyCell } from './ApyCell';

export const Position: React.FC<ProfitableSupplyPosition> = ({
  userSupplyBalanceTokens,
  currentSupplyApyPercentage,
  asset,
  supplyPosition,
}) => {
  const { t, Trans } = useTranslation();

  const { mutateAsync: importSupplyPosition, isPending: isImportSupplyPositionLoading } =
    useImportSupplyPosition({
      waitForConfirmation: true,
    });

  const readableUserSupplyBalance = formatTokensToReadableValue({
    value: userSupplyBalanceTokens,
    token: asset.vToken.underlyingToken,
    addSymbol: true,
  });

  const apyDelta = asset.supplyApyPercentage.minus(currentSupplyApyPercentage);
  const supplyBalanceCents = userSupplyBalanceTokens.multipliedBy(asset.tokenPriceCents);
  const missedYearlyGainsCents = calculateYearlyInterests({
    balance: supplyBalanceCents,
    interestPercentage: apyDelta,
  });

  const readableMissedYearlyGains = formatCentsToReadableValue({
    value: missedYearlyGainsCents,
  });

  const readableCurrentApy = formatPercentageToReadableValue(currentSupplyApyPercentage);

  const handleImport = () =>
    importSupplyPosition({
      position: supplyPosition,
      vToken: asset.vToken,
    });

  const importButtonClassName = cn('px-5 h-8 py-0 text-sm');

  return (
    <div className="border border-lightGrey rounded-xl px-4 py-3 space-y-3">
      <div className="flex justify-between items-center gap-x-2">
        <div className="flex items-center gap-x-2">
          <TokenIcon token={asset.vToken.underlyingToken} />

          <span className="font-bold">{readableUserSupplyBalance}</span>
        </div>

        <SwitchChain buttonClassName={importButtonClassName}>
          <Button
            className={importButtonClassName}
            onClick={handleImport}
            loading={isImportSupplyPositionLoading}
          >
            {t('importPositionsModal.position.importButtonLabel')}
          </Button>
        </SwitchChain>
      </div>

      <Delimiter />

      <div className="space-y-3 lg:space-y-0 lg:flex lg:justify-between lg:items-center lg:gap-x-6">
        <div className="flex justify-between items-center gap-x-2 relative grow">
          <ApyCell label={t('importPositionsModal.position.currentApy.label')}>
            {readableCurrentApy}
          </ApyCell>

          <div className="h-6 w-6 rounded-full bg-lightGrey absolute inset-0 m-auto flex items-center justify-center">
            <Icon name="arrowShaft" className="text-offWhite" />
          </div>

          <ApyCell label={t('importPositionsModal.position.newApy.label')}>
            <Apy asset={asset} type="supply" />
          </ApyCell>
        </div>

        <p className="text-grey text-right text-xs">
          <Trans
            i18nKey="importPositionsModal.position.missedYearlyGains"
            values={{ gains: readableMissedYearlyGains }}
            components={{
              // We need to wrap missed gains in a span tag to prevent bad escaping when the string
              // starts with a "<" character
              Gains: <span>{readableMissedYearlyGains}</span>,
              Number: <span className="text-offWhite text-sm lg:block lg:mt-1" />,
            }}
          />
        </p>
      </div>
    </div>
  );
};
