import { type ButtonProps, cn } from '@venusprotocol/ui';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { Icon, Username } from 'components';
import { useTranslation } from 'libs/translations';
import type { Address } from 'viem';

export interface UserButtonProps extends Pick<ButtonProps, 'onClick' | 'disabled' | 'className'> {
  address: Address;
  isPrime: boolean;
}

export const UserButton: React.FC<UserButtonProps> = ({
  address,
  isPrime,
  disabled,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={cn(
        'group h-10 text-b1s text-white rounded-lg p-px sm:h-12',
        disabled && (isPrime ? 'md:min-w-36.75' : 'md:min-w-36.25'),
        !disabled && 'cursor-pointer',
        !disabled && (isPrime ? 'min-w-21.25 sm:min-w-36.75' : 'min-w-20.75 sm:min-w-36.25'),
        isPrime ? 'bg-[linear-gradient(135deg,#FFECE3,#6D4637,#674031)]' : 'bg-dark-blue-hover',
        className,
      )}
      {...otherProps}
    >
      <div
        className={cn(
          'relative px-3 flex items-center gap-x-3 bg-background-active h-full rounded-[7px] transition-colors',
          !disabled && 'max-sm:px-2 max-sm:gap-x-2 group-hover:bg-dark-blue-hover',
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
        >
          {disabled
            ? undefined
            : ({ innerContent }) => (
                <>
                  <span className="max-sm:hidden">{innerContent}</span>
                  <span className="sm:hidden">{`${address.slice(0, 2)}...${address.slice(
                    -2,
                  )}`}</span>
                </>
              )}
        </Username>

        {!disabled && <Icon name="expand" className="text-light-grey max-sm:hidden" />}
      </div>
    </button>
  );
};
