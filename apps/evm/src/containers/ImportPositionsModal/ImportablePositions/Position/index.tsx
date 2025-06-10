import BigNumber from 'bignumber.js';
import { Apy, Button, Delimiter, Icon, TokenIcon } from 'components';
import { useTranslation } from 'libs/translations';
import type { Asset, Token } from 'types';
import {
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';
import { ApyCell } from './ApyCell';

export interface PositionProps {
  userSupplyBalanceTokens: BigNumber;
  token: Token;
  currentSupplyApyPercentage: BigNumber;
  asset: Asset;
}

export const Position: React.FC<PositionProps> = ({
  userSupplyBalanceTokens,
  currentSupplyApyPercentage,
  token,
  asset,
}) => {
  const { t, Trans } = useTranslation();

  const readableUserSupplyBalance = formatTokensToReadableValue({
    value: userSupplyBalanceTokens,
    token,
    addSymbol: true,
  });

  // TODO: calculate based on user supply balance and supply APYs' delta
  const potentialYearlyGainsCents = new BigNumber(100);

  const readablePotentialYearlyGains = formatCentsToReadableValue({
    value: potentialYearlyGainsCents,
  });

  const readableCurrentApy = formatPercentageToReadableValue(currentSupplyApyPercentage);

  const handleImport = () => {
    // TODO: wire up
  };

  return (
    <div className="border border-lightGrey rounded-xl px-4 py-3 space-y-3">
      <div className="flex justify-between items-center gap-x-2">
        <div className="flex items-center gap-x-2">
          <TokenIcon token={token} />

          <span className="font-bold">{readableUserSupplyBalance}</span>
        </div>

        <Button className="px-5 h-8 py-0 text-sm" onClick={handleImport}>
          {t('importPositionsModal.position.importButtonLabel')}
        </Button>
      </div>

      <Delimiter />

      <div className="flex justify-between items-center gap-x-2 relative">
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
          i18nKey="importPositionsModal.position.potentialYearlyGains"
          values={{ potentialYearlyGains: readablePotentialYearlyGains }}
          components={{ Number: <span className="text-offWhite text-sm" /> }}
        />
      </p>
    </div>
  );
};
