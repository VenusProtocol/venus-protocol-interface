import { Icon } from 'components';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

export interface CopyAddressButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  address: string;
}

export const CopyAddressButton: React.FC<CopyAddressButtonProps> = ({
  address,
  className,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.walletAddress'));

  return (
    <button
      type="button"
      className={cn(
        'text-blue hover:text-darkBlue active:text-darkBlue cursor-pointer transition-colors',
        className,
      )}
      onClick={() => copyToClipboard(address)}
      {...otherProps}
    >
      <Icon name="copy" className="h-4 w-4 text-inherit" />
    </button>
  );
};
