/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Icon, Toggle, Tooltip } from 'components';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';

import { useGetUserMarketInfo } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import HigherRiskTokensNotice from './HigherRiskTokensNotice';
import Markets from './Markets';
import { useStyles } from './styles';

interface DashboardUiProps {
  accountAddress: string;
  userTotalBorrowLimitCents: BigNumber;
  areHigherRiskTokensDisplayed: boolean;
  onHigherRiskTokensToggleChange: (newValue: boolean) => void;
  assets: Asset[];
}

const DashboardUi: React.FC<DashboardUiProps> = ({
  accountAddress,
  assets,
  areHigherRiskTokensDisplayed,
  onHigherRiskTokensToggleChange,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <>
      <HigherRiskTokensNotice />

      <div css={styles.header}>
        <div>{/* TODO: add tabs here */}</div>

        {/* TODO: add search input */}

        <div css={styles.toggleContainer}>
          <Tooltip css={styles.tooltip} title={t('dashboard.riskyTokensToggleTooltip')}>
            <Icon css={styles.infoIcon} name="info" />
          </Tooltip>

          <Typography
            color="text.primary"
            variant="small1"
            component="span"
            css={styles.toggleLabel}
          >
            {t('dashboard.riskyTokensToggleLabel')}
          </Typography>

          <Toggle
            css={styles.toggle}
            value={areHigherRiskTokensDisplayed}
            onChange={event => onHigherRiskTokensToggleChange(event.currentTarget.checked)}
          />
        </div>
      </div>

      <Markets
        isXvsEnabled
        accountAddress={accountAddress}
        // TODO: refactor to pass just one assets prop
        supplyMarketAssets={assets}
        borrowMarketAssets={assets}
      />
    </>
  );
};

const Dashboard: React.FC = () => {
  const { account } = useContext(AuthContext);
  const accountAddress = account?.address || '';

  const [areHigherRiskTokensDisplayed, setAreHigherRiskTokensDisplayed] = useState(false);

  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: { assets, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  return (
    <DashboardUi
      accountAddress={accountAddress}
      assets={assets}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      areHigherRiskTokensDisplayed={areHigherRiskTokensDisplayed}
      onHigherRiskTokensToggleChange={setAreHigherRiskTokensDisplayed}
    />
  );
};

export default Dashboard;
