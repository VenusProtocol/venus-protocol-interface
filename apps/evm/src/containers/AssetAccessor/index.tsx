import { useGetPool } from 'clients/api';
import { NoticeWarning, Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Asset, Pool, TokenAction, VToken } from 'types';
import { areTokensEqual } from 'utilities';

import { EModeButton } from 'components/EModeBanner/EModeButton';
import { useTranslation } from 'libs/translations';
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

  if (asset.disabledTokenActions.includes(action) || (action === 'borrow' && !asset.isBorrowable)) {
    return <DisabledActionNotice token={vToken.underlyingToken} action={action} />;
  }

  if (action === 'borrow' && !asset.isBorrowableByUser) {
    return (
      <NoticeWarning
        description={
          <Trans
            i18nKey="assetAccessor.eModeBlockedActionNotice.borrow"
            components={{
              Link: (
                <EModeButton
                  variant="text"
                  className="p-0 h-auto text-blue font-normal"
                  poolComptrollerContractAddress={poolComptrollerAddress}
                  analyticVariant="market_borrow_banner"
                />
              ),
            }}
          />
        }
      />
    );
  }

  return children({ asset, pool });
};

export default AssetAccessor;
