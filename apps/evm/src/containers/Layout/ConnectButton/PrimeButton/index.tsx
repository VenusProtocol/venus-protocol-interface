import primeLogoSrc from 'assets/img/primeLogo.svg';
import { type ButtonProps, SecondaryButton } from 'components';
import { useTranslation } from 'libs/translations';
import { cn, truncateAddress } from 'utilities';

export interface PrimeButtonProps extends ButtonProps {
  accountAddress: string;
}

export const PrimeButton: React.FC<PrimeButtonProps> = ({
  accountAddress,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    // TODO: check border color is correct (Pavel needs to confirm)
    <SecondaryButton
      className={cn(
        'active:bg-cards border-[#805C4E] hover:border-[#805C4E] active:border-[#805C4E] hover:bg-offWhite/10 active:bg-offWhite/10',
        className,
      )}
      {...otherProps}
    >
      <>
        <img className="mr-2 w-5" src={primeLogoSrc} alt={t('PrimeButton.primeLogoAlt')} />

        {truncateAddress(accountAddress)}
      </>
    </SecondaryButton>
  );
};
