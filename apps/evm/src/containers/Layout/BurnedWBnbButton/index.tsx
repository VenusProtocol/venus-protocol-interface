import { ButtonWrapper, cn } from '@venusprotocol/ui';
import { Link } from 'containers/Link';

import { useGetBurnedWBnb } from 'clients/api';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { convertMantissaToTokens } from 'utilities';
import iconSrc from './icon.svg';

const BURNED_BNB_URL =
  'https://snapshot.box/#/s:venus-xvs.eth/proposal/0xb8f03ad2dd2988a6d2e89a1adbebc52c7a62b284ea493008752c71b7f00b3386';

export interface BurnedWBnbButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const BurnedWBnbButton: React.FC<BurnedWBnbButtonProps> = ({ className }) => {
  const { t } = useTranslation();
  const wBnbToken = useGetToken({
    symbol: 'WBNB',
  });
  const isBurnedWBnbButtonFeatureEnabled = useIsFeatureEnabled({ name: 'burnedBnbButton' });
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
    <ButtonWrapper
      className={cn(
        'px-3 underline text-offWhite font-normal bg-[#2A2529] border-[#2A2529] hover:bg-[#2A2529] hover:border-[#2A2529] active:bg-[#2A2529] active:border-[#2A2529]',
        className,
      )}
      asChild
    >
      <Link href={BURNED_BNB_URL} target="_blank">
        <div className="flex justify-center gap-x-1">
          <img src={iconSrc} alt={t('burnedBnbButton.iconAlt')} className="w-7" />

          {readableBurnedWBnb}
        </div>
      </Link>
    </ButtonWrapper>
  );
};
