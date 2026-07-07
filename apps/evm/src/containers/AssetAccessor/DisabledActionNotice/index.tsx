import { useMemo } from 'react';

import { NoticeWarning } from 'components';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import type { Token, TokenAction } from 'types';
import { areAddressesEqual } from 'utilities';

export interface DisabledActionNoticeProps {
  token: Token;
  action: TokenAction;
}

const DisabledActionNotice: React.FC<DisabledActionNoticeProps> = ({ token, action }) => {
  const { t, Trans } = useTranslation();

  const shouldDisplayTusdMigrationWarning = useIsFeatureEnabled({
    name: 'tusdMigrationWarning',
  });
  const shouldDisplayTrxMigrationWarning = useIsFeatureEnabled({
    name: 'trxMigrationWarning',
  });
  const shouldDisplaySxpDisablingWarning = useIsFeatureEnabled({
    name: 'sxpDisablingWarning',
  });
  const shouldDisplayBethUpdateWarning = useIsFeatureEnabled({
    name: 'bethUpdateWarning',
  });

  const description = useMemo(() => {
    // TUSD migration
    if (
      shouldDisplayTusdMigrationWarning &&
      areAddressesEqual(token.address, '0x14016e85a25aeb13065688cafb43044c2ef86784')
    ) {
      return (
        <Trans
          i18nKey="announcements.tusdMigration.description"
          components={{
            Link: (
              <Link href="https://www.binance.com/en/support/announcement/binance-will-support-the-trueusd-tusd-contract-swap-52b29fadf71542afabf23acf3454f9c7" />
            ),
          }}
        />
      );
    }

    // TRX migration
    if (
      shouldDisplayTrxMigrationWarning &&
      areAddressesEqual(token.address, '0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B')
    ) {
      return (
        <Trans
          i18nKey="announcements.trxMigration.description"
          components={{
            Link: (
              <Link href="https://www.binance.com/en/support/announcement/binance-will-support-the-tron-trx-contract-swap-494f53e94eb64adc8335b88f7e14006a" />
            ),
          }}
        />
      );
    }

    // SXP disabling
    if (
      shouldDisplaySxpDisablingWarning &&
      areAddressesEqual(token.address, '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A')
    ) {
      return t('announcements.sxpDisabling.description');
    }

    // BETH update
    if (
      shouldDisplayBethUpdateWarning &&
      areAddressesEqual(token.address, '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B')
    ) {
      return (
        <Trans
          i18nKey="announcements.bethUpdate.description"
          components={{
            Link: (
              <Link href="https://www.binance.com/en/support/announcement/binance-supports-beth-to-wbeth-conversion-on-bnb-smart-chain-a7d439452e034c3c85fcc7128d0973b0" />
            ),
          }}
        />
      );
    }

    if (action === 'supply') {
      return t('assetAccessor.disabledActionNotice.supply');
    }

    if (action === 'withdraw') {
      return t('assetAccessor.disabledActionNotice.withdraw');
    }

    if (action === 'borrow') {
      return t('assetAccessor.disabledActionNotice.borrow');
    }

    if (action === 'boost') {
      return t('assetAccessor.disabledActionNotice.boost');
    }

    if (action === 'repay') {
      return t('assetAccessor.disabledActionNotice.repay');
    }
  }, [
    action,
    t,
    Trans,
    shouldDisplayTusdMigrationWarning,
    shouldDisplayTrxMigrationWarning,
    shouldDisplaySxpDisablingWarning,
    shouldDisplayBethUpdateWarning,
    token.address,
  ]);

  return description && <NoticeWarning description={description} />;
};

export default DisabledActionNotice;
