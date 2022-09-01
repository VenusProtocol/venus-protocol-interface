/** @jsxImportSource @emotion/react */
import { Modal, ModalProps, Spinner, TabContent, Tabs, Token } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { isAssetEnabled } from 'utilities';

import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import Borrow from './Borrow';
import Repay from './Repay';
import { useStyles } from './styles';

export interface BorrowRepayProps {
  onClose: ModalProps['handleClose'];
  isXvsEnabled: boolean;
  assetId: Asset['id'];
}

const BorrowRepay: React.FC<BorrowRepayProps> = ({ onClose, assetId, isXvsEnabled }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { account } = React.useContext(AuthContext);

  // TODO: handle loading state (see https://jira.toolsfdg.net/browse/VEN-591)
  const {
    data: { assets },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  const asset = React.useMemo(
    () => assets.find(marketAsset => marketAsset.id === assetId),
    [assetId, JSON.stringify(assets)],
  );

  const tabsContent: TabContent[] = [
    {
      title: t('borrowRepayModal.repayTabTitle'),
      content: (
        <div css={styles.container}>
          {asset ? (
            <Repay asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
          ) : (
            <Spinner />
          )}
        </div>
      ),
    },
  ];

  if (asset && isAssetEnabled(asset.id)) {
    tabsContent.unshift({
      title: t('borrowRepayModal.borrowTabTitle'),
      content: (
        <div css={styles.container}>
          {asset ? (
            <Borrow asset={asset} onClose={onClose} isXvsEnabled={isXvsEnabled} />
          ) : (
            <Spinner />
          )}
        </div>
      ),
    });
  }

  return (
    <Modal isOpen title={<Token tokenId={assetId} variant="h4" />} handleClose={onClose}>
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

export default BorrowRepay;
