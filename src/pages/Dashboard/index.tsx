/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { NoticeInfo, NoticeWarning } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import { formatPercentage } from 'utilities';

import { useGetUserMarketInfo, useGetVaiRepayApy } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';

import Markets from './Markets';
import MintRepayVai from './MintRepayVai';
import MyAccount from './MyAccount';
import { useStyles } from './styles';

interface DashboardUiProps {
  accountAddress: string;
  userTotalBorrowLimitCents: BigNumber;
  userTotalBorrowBalanceCents: BigNumber;
  userTotalSupplyBalanceCents: BigNumber;
  assets: Asset[];
  vaiApyPercentage?: BigNumber;
}

const DashboardUi: React.FC<DashboardUiProps> = ({
  accountAddress,
  assets,
  userTotalBorrowLimitCents,
  userTotalBorrowBalanceCents,
  userTotalSupplyBalanceCents,
  vaiApyPercentage,
}) => {
  const styles = useStyles();
  const { Trans } = useTranslation();
  const [isXvsEnabled, setIsXvsEnabled] = React.useState(true);

  const { suppliedAssets, supplyMarketAssets, borrowingAssets, borrowMarketAssets } =
    useMemo(() => {
      const sortedAssets = assets.reduce(
        (acc, curr) => {
          if (curr.supplyBalance.isGreaterThan(0)) {
            acc.suppliedAssets.push(curr);
          } else {
            acc.supplyMarketAssets.push(curr);
          }

          if (curr.borrowBalance.isGreaterThan(0)) {
            acc.borrowingAssets.push(curr);
          } else if (curr.token.address !== TOKENS.xvs.address) {
            acc.borrowMarketAssets.push(curr);
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
      <NoticeWarning
        css={styles.banner}
        description={
          <Trans
            i18nKey="dashboard.bethUpdateBanner.description"
            components={{
              Link: (
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <a
                  href="https://binance.com/en/support/announcement/binance-introduces-wrapped-beacon-eth-wbeth-on-eth-staking-a1197f34d832445db41654ad01f56b4d"
                  rel="noreferrer"
                  target="_blank"
                />
              ),
            }}
          />
        }
      />

      {vaiApyPercentage && (
        <NoticeInfo
          css={styles.banner}
          description={
            <Trans
              i18nKey="dashboard.vaiStabilityFeeBanner.description"
              components={{
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                Link: <a href="https://app.venus.io/governance/proposal/92" rel="noreferrer" />,
              }}
              values={{ feePercentage: formatPercentage(vaiApyPercentage) }}
            />
          }
        />
      )}

      <div css={styles.row}>
        <MyAccount
          assets={assets}
          setIsXvsEnabled={setIsXvsEnabled}
          isXvsEnabled={isXvsEnabled}
          css={styles.column}
          userTotalBorrowLimitCents={userTotalBorrowLimitCents}
          userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
          userTotalSupplyBalanceCents={userTotalSupplyBalanceCents}
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

  const { data: getVaiRepayApyData } = useGetVaiRepayApy();

  return (
    <DashboardUi
      accountAddress={accountAddress}
      assets={assets}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
      userTotalSupplyBalanceCents={userTotalSupplyBalanceCents}
      vaiApyPercentage={getVaiRepayApyData?.repayApyPercentage}
    />
  );
};

export default Dashboard;
