/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';

import { Spinner } from 'components';
import { AuthContext } from 'context/AuthContext';
import { useGetVaults } from 'clients/api';
import { Vault } from 'types';
import VaultItem from './VaultItem';
import { useStyles } from './styles';

export interface IVaultUi {
  vaults: Vault[];
}

const VaultUi: React.FC<IVaultUi> = ({ vaults }) => {
  const styles = useStyles();

  if (vaults.length === 0) {
    return <Spinner />;
  }

  // TODO: return vaults;

  return (
    <div css={styles.container}>
      {/* TODO: display actual vaults */}
      <VaultItem
        tokenId="vai"
        rewardTokenId="xvs"
        rewardWei={new BigNumber('000900000000000000')}
        userStakedWei={new BigNumber('100000000000000000000')}
        stakingAprPercentage={2.39}
        dailyEmissionWei={new BigNumber('2120000000000000000')}
        totalStakedWei={new BigNumber('1233000000000000000000')}
        onClaim={noop}
        onStake={noop}
        onReward={noop}
      />

      <VaultItem
        tokenId="vai"
        rewardTokenId="xvs"
        rewardWei={new BigNumber('000900000000000000')}
        userStakedWei={new BigNumber('100000000000000000000')}
        stakingAprPercentage={2.39}
        dailyEmissionWei={new BigNumber('2120000000000000000')}
        totalStakedWei={new BigNumber('1233000000000000000000')}
        onClaim={noop}
        onStake={noop}
        onReward={noop}
      />

      <VaultItem
        tokenId="vai"
        rewardTokenId="xvs"
        rewardWei={new BigNumber('000900000000000000')}
        userStakedWei={new BigNumber('100000000000000000000')}
        stakingAprPercentage={2.39}
        dailyEmissionWei={new BigNumber('2120000000000000000')}
        totalStakedWei={new BigNumber('1233000000000000000000')}
        onClaim={noop}
        onStake={noop}
        onReward={noop}
      />
    </div>
  );
};

const VaultPage: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { data: vaults } = useGetVaults({
    accountAddress: account?.address,
  });

  return <VaultUi vaults={vaults} />;
};

export default VaultPage;
