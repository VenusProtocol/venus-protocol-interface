/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { AuthContext } from 'context/AuthContext';
import { useGetUserMarketInfo } from 'clients/api';
import { Asset } from 'types';

import MyAccount from './MyAccount';
import MintRepayVai from './MintRepayVai';
import { LunaUstWarningModal } from './Modals';
import Markets from './Markets';
import useLunaUstWarningModal from './useLunaUstWarningModal';
import { useStyles } from './styles';

interface IDashboardUiProps {
  accountAddress: string;
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
  assets: Asset[];
}

const DashboardUi: React.FC<IDashboardUiProps> = ({
  accountAddress,
  assets,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents,
  userTotalSupplyBalanceCents,
}) => {
  const styles = useStyles();
  const [isXvsEnabled, setIsXvsEnabled] = React.useState(true);
  const [shouldShowLunaUstWarningModal, closeLunaUstWarningModal] = useLunaUstWarningModal(assets);

  const { suppliedAssets, supplyMarketAssets, borrowingAssets, borrowMarketAssets } =
    useMemo(() => {
      const sortedAssets = assets.reduce(
        (acc, curr) => {
          if (curr.supplyBalance.isZero()) {
            acc.supplyMarketAssets.push(curr);
          } else {
            acc.suppliedAssets.push(curr);
          }

          if (curr.borrowBalance.isZero()) {
            acc.borrowMarketAssets.push(curr);
          } else {
            acc.borrowingAssets.push(curr);
          }
          return acc;
        },
        {
          suppliedAssets: [] as Asset[],
          supplyMarketAssets: [] as Asset[],
          borrowingAssets: [] as Asset[],
          borrowMarketAssets: [] as Asset[],
        },
      );
      return sortedAssets;
    }, [JSON.stringify(assets)]);

  return (
    <>
      <div css={styles.row}>
        <MyAccount
          assets={assets}
          setIsXvsEnabled={setIsXvsEnabled}
          isXvsEnabled={isXvsEnabled}
          css={styles.column}
          userTotalBorrowLimitCents={userTotalBorrowLimitCents}
          userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
          userTotalSupplyBalanceCents={userTotalSupplyBalanceCents}
          accountAddress={accountAddress}
        />

        <MintRepayVai css={styles.column} />
      </div>

      <Markets
        isXvsEnabled={isXvsEnabled}
        accountAddress={accountAddress}
        userTotalBorrowLimitCents={userTotalBorrowLimitCents}
        suppliedAssets={suppliedAssets}
        supplyMarketAssets={supplyMarketAssets}
        borrowingAssets={borrowingAssets}
        borrowMarketAssets={borrowMarketAssets}
      />

      {shouldShowLunaUstWarningModal && <LunaUstWarningModal onClose={closeLunaUstWarningModal} />}
    </>
  );
};

const Dashboard: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const accountAddress = account?.address || '';
  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: {
      assets,
      userTotalBorrowLimitCents,
      userTotalBorrowBalanceCents,
      userTotalSupplyBalanceCents,
    },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  return (
    <DashboardUi
      accountAddress={accountAddress}
      assets={assets}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
      userTotalSupplyBalanceCents={userTotalSupplyBalanceCents}
    />
  );
};

export default Dashboard;
