import { useGetSponsorshipVaultData } from 'clients/api';
import { Icon, Tooltip } from 'components';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { cn } from 'utilities';

export interface GaslessStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  chainId?: ChainId;
  wrapWithTooltip?: boolean;
  displayLabel?: boolean;
}

export const GaslessStatus: React.FC<GaslessStatusProps> = ({
  chainId,
  wrapWithTooltip = false,
  displayLabel = false,
  className,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();
  const { chainId: chainIdFromHook } = useChainId();
  const { data: sponsorshipVaultData } = useGetSponsorshipVaultData({
    chainId: chainId ?? chainIdFromHook,
  });

  if (sponsorshipVaultData?.hasEnoughFunds !== true) {
    return undefined;
  }

  const contentDom = (
    <div
      className={cn(
        'text-green [font-variant:all-small-caps] flex items-center gap-x-[2px]',
        className,
      )}
      {...otherProps}
    >
      <Icon name={displayLabel ? 'gas' : 'gasSlashed'} className="text-green" />

      {displayLabel && <span className="font-semibold">{t('gaslessTransactions.chainLabel')}</span>}
    </div>
  );

  if (wrapWithTooltip) {
    // @TODO: add link to docs
    return (
      <Tooltip
        title={
          <Trans
            i18nKey="gaslessTransactions.tooltip"
            components={{
              Link: <Link href={''} />,
            }}
          />
        }
      >
        {contentDom}
      </Tooltip>
    );
  }

  return contentDom;
};
