import { Icon, Tooltip } from 'components';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

export interface CopyAddressButtonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
  address: string;
  showTooltip?: boolean;
}

export const CopyAddressButton: React.FC<CopyAddressButtonProps> = ({
  address,
  className,
  showTooltip,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.address.name'));

  const dom = (
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

  return showTooltip ? (
    <Tooltip title={t('interactive.copy.address.tooltip')} className="inline-flex">
      {dom}
    </Tooltip>
  ) : (
    dom
  );
};
