import { cn } from '@venusprotocol/ui';
import { Link } from 'containers/Link';

import { useGetBurnedWBnb } from 'clients/api';
import { BURNED_WBNB_SNAPSHOT_URL } from 'constants/burnedWBnb';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { convertMantissaToTokens } from 'utilities';
import { NavButtonWrapper } from '../NavButtonWrapper';
import iconSrc from './icon.svg';

export interface BurnedWBnbButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const BurnedWBnbButton: React.FC<BurnedWBnbButtonProps> = ({ className }) => {
  const { t } = useTranslation();
  const wBnbToken = useGetToken({
    symbol: 'WBNB',
  });
  const isBurnedWBnbButtonFeatureEnabled = useIsFeatureEnabled({ name: 'burnedWBnbButton' });
  const { data: getBurnedWBnbMantissaData } = useGetBurnedWBnb();
  const burnedWBnbMantissa = getBurnedWBnbMantissaData?.burnedWBnbMantissa;

  if (!wBnbToken || !isBurnedWBnbButtonFeatureEnabled || !burnedWBnbMantissa) {
    return undefined;
  }

  const readableBurnedWBnb = convertMantissaToTokens({
    value: burnedWBnbMantissa,
    token: wBnbToken,
    addSymbol: false,
    returnInReadableFormat: true,
    maxDecimalPlaces: 0,
  });

  return (
    <NavButtonWrapper
      className={cn('flex items-center hover:text-white active:text-white', className)}
      asChild
    >
      <Link href={BURNED_WBNB_SNAPSHOT_URL} target="_blank">
        <div className="flex justify-center gap-x-1">
          <img src={iconSrc} alt={t('burnedWBnbButton.iconAlt')} className="w-7" />

          {readableBurnedWBnb}
        </div>
      </Link>
    </NavButtonWrapper>
  );
};
