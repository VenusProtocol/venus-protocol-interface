import { type ButtonProps, cn } from '@venusprotocol/ui';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { Icon, Username } from 'components';
import { useTranslation } from 'libs/translations';
import type { Address } from 'viem';
import vipLogoSrc from './vipLogo.svg';

export interface UserButtonProps extends Pick<ButtonProps, 'onClick' | 'disabled' | 'className'> {
  address: Address;
  isPrime: boolean;
  isVip: boolean;
}

export const UserButton: React.FC<UserButtonProps> = ({
  address,
  isPrime,
  isVip,
  disabled,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={cn(
        'group h-10 text-b1s rounded-lg p-px sm:h-12',
        !disabled && 'cursor-pointer',
        isPrime ? 'bg-[linear-gradient(135deg,#FFECE3,#6D4637,#674031)]' : 'bg-dark-blue-hover',
        className,
      )}
      {...otherProps}
    >
      <div
        className={cn(
          'relative px-3 flex items-center gap-x-3 bg-background-active h-full rounded-[7px] transition-colors',
          !disabled && 'group-hover:bg-dark-blue-hover',
        )}
      >
        {isPrime ? (
          <img className="h-4" src={primeLogoSrc} alt={t('primeButton.primeLogoAlt')} />
        ) : (
          <Icon name="user" className="h-4 text-light-grey mb-1" />
        )}

        <Username
          className="max-w-30 sm:max-w-full"
          showProvider={false}
          showTooltip={false}
          address={address}
          shouldEllipseAddress
        />

        {isVip && <img src={vipLogoSrc} alt={t('connectButton.vipLogoAlt')} className="size-4.5" />}

        {!isVip && !disabled && <Icon name="expand" className="text-light-grey" />}
      </div>
    </button>
  );
};
