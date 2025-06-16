import { Icon, InfoIcon } from 'components';
import type { ProfitableSupplyPosition } from 'hooks/useGetProfitableImports';
import { useTranslation } from 'libs/translations';
import { Position } from './Position';

export interface ProtocolPositionsProps {
  protocolLogoSrc: string;
  protocolLogoAlt: string;
  positions: ProfitableSupplyPosition[];
}

export const ProtocolPositions: React.FC<ProtocolPositionsProps> = ({
  protocolLogoSrc,
  protocolLogoAlt,
  positions,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex gap-x-2 justify-between">
        <img src={protocolLogoSrc} alt={protocolLogoAlt} className="h-6 max-w-full" />

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
            key={`${protocolLogoAlt}-${position.asset.vToken.underlyingToken.symbol}`}
            {...position}
          />
        ))}
      </div>
    </div>
  );
};
