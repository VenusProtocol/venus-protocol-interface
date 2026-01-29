import { cn } from '@venusprotocol/ui';
import { useGetPaymasterInfo } from 'clients/api';
import { Icon, Tooltip } from 'components';
import { VENUS_DOC_URL } from 'constants/production';
import { Link } from 'containers/Link';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useTranslation } from 'libs/translations';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

const VENUS_DOC_GASLESS_URL = `${VENUS_DOC_URL}/guides/gasless-transactions-zksync`;

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
  const { data: sponsorshipVaultData } = useGetPaymasterInfo({
    chainId: chainId ?? chainIdFromHook,
  });

  const [userChainSettings] = useUserChainSettings();

  if (!sponsorshipVaultData?.canSponsorTransactions) {
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
    return (
      <Tooltip
        content={
          <Trans
            // Translation key: do not remove this comment
            // t('gaslessTransactions.tooltip.enabled')
            // t('gaslessTransactions.tooltip.disabled')
            i18nKey={
              userChainSettings.gaslessTransactions
                ? 'gaslessTransactions.tooltip.enabled'
                : 'gaslessTransactions.tooltip.disabled'
            }
            components={{
              Link: <Link href={VENUS_DOC_GASLESS_URL} />,
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
