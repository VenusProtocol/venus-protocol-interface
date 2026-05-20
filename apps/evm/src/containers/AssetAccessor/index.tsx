import { useGetPool } from 'clients/api';
import { NoticeWarning, Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool, TokenAction, VToken } from 'types';
import { areTokensEqual } from 'utilities';

import { useTranslation } from 'libs/translations';
import { EModeButton } from 'pages/Market/OperationForm/BorrowForm/EModeBanner/EModeButton';
import type { Address } from 'viem';
import DisabledActionNotice from './DisabledActionNotice';

export interface AssetAccessorProps {
  vToken: VToken;
  poolComptrollerAddress: Address;
  action: TokenAction;
  children: (props: { asset: Asset; pool: Pool }) => React.ReactNode;
}

const AssetAccessor: React.FC<AssetAccessorProps> = ({
  vToken,
  poolComptrollerAddress,
  children,
  action,
}) => {
  const { accountAddress } = useAccountAddress();
  const { Trans } = useTranslation();

  const { data: getPools } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPools?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  if (!pool || !asset) {
    return <Spinner />;
  }

  const isBorrowAction = action === 'borrow' || action === 'boost';

  if (isBorrowAction && !asset.isBorrowableByUser) {
    const components = {
      Link: (
        <EModeButton
          variant="text"
          className="p-0 h-auto text-blue font-normal"
          poolComptrollerContractAddress={poolComptrollerAddress}
          analyticVariant="market_borrow_banner"
        />
      ),
    };

    return asset.isBorrowable ? (
      // If the asset is normally borrowable from the pool, then the user's E-mode group settings
      // are preventing them from being able to borrow it
      <NoticeWarning
        description={
          pool.userEModeGroup?.isIsolated ? (
            <Trans
              i18nKey="assetAccessor.isolationModeBlockedActionNotice.borrow"
              components={components}
            />
          ) : (
            <Trans
              i18nKey="assetAccessor.eModeBlockedActionNotice.borrow"
              components={components}
            />
          )
        }
      />
    ) : (
      <DisabledActionNotice token={vToken.underlyingToken} action={action} />
    );
  }

  if (asset.disabledTokenActions.includes(action)) {
    return <DisabledActionNotice token={vToken.underlyingToken} action={action} />;
  }

  return children({ asset, pool });
};

export default AssetAccessor;
