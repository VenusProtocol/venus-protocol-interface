import { Icon, InfoIcon } from 'components';
import type { ProfitableSupplyPosition } from 'hooks/useGetProfitableImports';
import { useTranslation } from 'libs/translations';
import { Position } from './Position';

export interface ProtocolPositionsProps {
  protocolLogoSrc: string;
  protocolLogoAlt: string;
  protocolName: string;
  positions: ProfitableSupplyPosition[];
}

export const ProtocolPositions: React.FC<ProtocolPositionsProps> = ({
  protocolLogoSrc,
  protocolLogoAlt,
  protocolName,
  positions,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex gap-x-2 justify-between">
        <div className="flex items-center gap-x-2">
          <img src={protocolLogoSrc} alt={protocolLogoAlt} className="h-6 max-w-full" />

          <h4 className="text-lg leading-7">{protocolName}</h4>
        </div>

        <div className="flex items-center gap-x-1">
          <Icon name="gas" className="text-green" />

          <span className="text-green text-sm font-semibold [font-variant:all-small-caps]">
            {t('importPositionsModal.gasLess.label')}
          </span>

          <InfoIcon tooltip={t('importPositionsModal.gasLess.tooltip')} />
        </div>
      </div>

      <div className="space-y-3">
        {positions.map(position => (
          <Position
            key={`${position.supplyPosition.protocol}-${position.asset.vToken.address}-${
              position.currentSupplyApyPercentage
            }-${position.userSupplyBalanceTokens.toFixed()}`}
            {...position}
          />
        ))}
      </div>
    </div>
  );
};
