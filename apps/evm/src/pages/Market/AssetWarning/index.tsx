import { useState } from 'react';

import { useTranslation } from 'libs/translations';
import type { Pool, Token } from 'types';

import { Modal, Notice, TextButton } from 'components';
import { MarketTable } from 'containers/MarketTable';
import { useBreakpointUp } from 'hooks/responsive';
import TEST_IDS from './testIds';
import type { WarningType } from './types';

export interface AssetWarningProps extends React.HTMLAttributes<HTMLDivElement> {
  type: WarningType;
  token: Token;
  pool?: Pool;
  className?: string;
}

export const AssetWarning: React.FC<AssetWarningProps> = ({
  pool,
  token,
  type,
  className,
  ...otherProps
}) => {
  const [showAssets, setShowAssets] = useState(false);
  const { t, Trans } = useTranslation();
  const isSmOrUp = useBreakpointUp('sm');

  const translationArgs = {
    poolName: pool?.name,
    tokenSymbol: token.symbol,
  };

  const handleShowAssets = () => setShowAssets(true);
  const handleHideAssets = () => setShowAssets(false);

  if (!pool) {
    return null;
  }

  return (
    <div className={className} {...otherProps}>
      <Notice
        className="mb-2"
        description={
          <Trans
            // Translation key: do not remove this comment
            // t('assetWarning.borrowDescription')
            // t('assetWarning.supplyDescription')
            i18nKey={
              type === 'borrow'
                ? 'assetWarning.borrowDescription'
                : 'assetWarning.supplyDescription'
            }
            values={translationArgs}
            components={{
              Button: (
                <TextButton
                  className="p-0 h-auto font-medium text-xs md:text-sm"
                  onClick={handleShowAssets}
                />
              ),
            }}
          />
        }
      />

      <Modal
        isOpen={showAssets}
        handleClose={handleHideAssets}
        noHorizontalPadding={isSmOrUp}
        title={t('assetWarning.modalTitle', {
          poolName: pool.name,
        })}
      >
        <MarketTable
          data-testid={TEST_IDS.marketTable}
          rowOnClick={handleHideAssets}
          controls={false}
          variant="secondary"
          selectVariant="quaternary"
          breakpoint="sm"
          cardClassName="p-0 pb-4 border-b-lightGrey rounded-none not-last-of-type:border-b [&>hr]:h-0 [&>hr]:my-2"
          className="my-0 p-0 sm:p-0"
          poolName={pool.name}
          poolComptrollerContractAddress={pool.comptrollerAddress}
          assets={pool.assets}
          userEModeGroup={pool.userEModeGroup}
          columns={['asset', type === 'borrow' ? 'labeledBorrowApy' : 'supplyApy', 'liquidity']}
          initialOrder={{
            orderBy: type === 'borrow' ? 'labeledBorrowApy' : 'supplyApy',
            orderDirection: type === 'supply' ? 'desc' : 'asc',
          }}
        />
      </Modal>
    </div>
  );
};

export default AssetWarning;
