import { cn } from '@venusprotocol/ui';
import { useImportSupplyPosition } from 'clients/api';
import { Apy, Button, Delimiter, Icon, TokenIcon } from 'components';
import { routes } from 'constants/routing';
import { SwitchChain } from 'containers/SwitchChain';
import {
  type ProfitableSupplyPosition,
  useGetProfitableImports,
} from 'hooks/useGetProfitableImports';
import { useNavigate } from 'hooks/useNavigate';
import { useAnalytics } from 'libs/analytics';
import { handleError, isUserRejectedTxError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import {
  calculateYearlyInterests,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
  getCombinedDistributionApys,
} from 'utilities';
import { ApyCell } from './ApyCell';

export type PropositionProps = ProfitableSupplyPosition;

export const Position: React.FC<PropositionProps> = ({
  userSupplyBalanceTokens,
  currentSupplyApyPercentage,
  asset,
  supplyPosition,
}) => {
  const { t, Trans } = useTranslation();
  const { navigate } = useNavigate();
  const { captureAnalyticEvent } = useAnalytics();

  const { importablePositionsCount } = useGetProfitableImports();

  const combinedDistributionApys = getCombinedDistributionApys({ asset });
  const supplyApyPercentage = asset.supplyApyPercentage.plus(
    combinedDistributionApys.totalSupplyApyBoostPercentage,
  );
  const apyDelta = supplyApyPercentage.minus(currentSupplyApyPercentage);
  const supplyBalanceCents = userSupplyBalanceTokens.multipliedBy(asset.tokenPriceCents);

  const readableSupplyBalanceDollars = formatCentsToReadableValue({
    value: supplyBalanceCents,
  });

  const analyticProps = {
    fromProtocol: supplyPosition.protocol,
    fromTokenSymbol: asset.vToken.underlyingToken.symbol,
    fromTokenAmountTokens: userSupplyBalanceTokens.toNumber(),
    fromTokenAmountDollars: supplyBalanceCents.dividedBy(100).toNumber(),
    fromTokenApyPercentage: supplyPosition.supplyApyPercentage,
    toVTokenAddress: asset.vToken.address,
    toTokenApyPercentage: supplyApyPercentage.toNumber(),
  };

  const { mutate: importSupplyPosition, isPending: isImportSupplyPositionLoading } =
    useImportSupplyPosition({
      waitForConfirmation: true,
      onError: error => {
        if (isUserRejectedTxError({ error })) {
          captureAnalyticEvent('Position import canceled', analyticProps);
        } else {
          captureAnalyticEvent('Position import status unknown', analyticProps);
        }

        handleError({ error });
      },
      onConfirmed: () => {
        captureAnalyticEvent('Position imported', analyticProps);

        // Redirect to Account page if this was the last importable position
        if (importablePositionsCount === 1) {
          navigate(routes.dashboard.path);
        }
      },
    });

  const readableUserSupplyBalance = formatTokensToReadableValue({
    value: userSupplyBalanceTokens,
    token: asset.vToken.underlyingToken,
    addSymbol: true,
  });

  const missedYearlyGainsCents = calculateYearlyInterests({
    balance: supplyBalanceCents,
    interestPercentage: apyDelta,
  });

  const readableMissedYearlyGains = formatCentsToReadableValue({
    value: missedYearlyGainsCents,
  });

  const readableCurrentApy = formatPercentageToReadableValue(currentSupplyApyPercentage);

  const handleImport = () => {
    importSupplyPosition({
      position: supplyPosition,
      vToken: asset.vToken,
    });

    captureAnalyticEvent('Position import initiated', analyticProps);
  };

  const importButtonClassName = cn('px-5 h-8 py-0 text-sm');

  return (
    <div className="border border-lightGrey rounded-xl px-4 py-3 space-y-3">
      <div className="flex justify-between items-center gap-x-2">
        <div className="flex items-center gap-x-2">
          <TokenIcon token={asset.vToken.underlyingToken} />

          <div className="flex flex-col">
            <span className="font-bold">{readableUserSupplyBalance}</span>
            <span className="text-sm text-grey">{readableSupplyBalanceDollars}</span>
          </div>
        </div>

        <SwitchChain buttonClassName={importButtonClassName} className="flex">
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
            <Icon name="arrowShaft" className="text-white" />
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
              Number: <span className="text-white text-sm lg:block lg:mt-1" />,
            }}
          />
        </p>
      </div>
    </div>
  );
};
