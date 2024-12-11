import primeLogoSrc from 'assets/img/primeLogo.svg';
import { type ButtonProps, SecondaryButton, Username } from 'components';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

export interface PrimeButtonProps extends ButtonProps {
  accountAddress: string;
  addressDomainName?: string | null;
}

export const PrimeButton: React.FC<PrimeButtonProps> = ({
  accountAddress,
  addressDomainName,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <SecondaryButton
      className={cn(
        'border-[#805C4E] hover:border-[#805C4E] active:border-[#805C4E] hover:bg-lightGrey active:bg-lightGrey',
        className,
      )}
      {...otherProps}
    >
      <>
        <img className="mr-2 w-5" src={primeLogoSrc} alt={t('PrimeButton.primeLogoAlt')} />

        <Username
          address={accountAddress}
          className="max-w-20 sm:max-w-full"
          showTooltip={false}
          showProvider={false}
        />
      </>
    </SecondaryButton>
  );
};
