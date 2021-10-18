import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import commaNumber from 'comma-number';
import { Card } from 'components/Basic/Card';
import vaiImg from 'assets/img/coins/vai.svg';
import xvsImg from 'assets/img/venus_32.png';
import { useWeb3React } from '@web3-react/core';
import { useMarketsUser } from '../../hooks/useMarketsUser';
import { useVaiVault } from '../../hooks/useContract';

const UserInfoWrapper = styled.div`
  width: 100%;
  height: 520px;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  padding: 20px 40px;

  @media (max-width: 992px) {
    padding: 20px;
    height: 100%;
  }

  .total-item {
    margin: 20px 0;
    @media (max-width: 992px) {
      margin: 10px;
    }

    .prop {
      font-weight: 600;
      font-size: 20px;
      color: var(--color-text-secondary);
    }

    .value {
      font-weight: 600;
      font-size: 24px;
      color: var(--color-white);
      margin-top: 10px;

      img {
        width: 24px;
        margin-right: 10px;
      }

      .claim-btn {
        font-size: 18px;
        font-weight: bold;
        color: var(--color-orange);
        margin-left: 10px;
      }
      .disable-btn {
        color: var(--color-text-secondary);
      }
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

function UserInfo({ availableVai, vaiStaked, vaiReward }) {
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useWeb3React();
  const { userXVSBalance } = useMarketsUser();
  const vaiVaultContract = useVaiVault();

  const handleClaimReward = async () => {
    if (isLoading || vaiReward === '0') return;
    setIsLoading(true);
    try {
      await vaiVaultContract.methods.claim().send({ from: account });
    } catch (error) {
      console.log('claim error :>> ', error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <UserInfoWrapper>
        <div className="total-item">
          <div className="prop">Available VAI to stake</div>
          <div className="flex align-center value">
            <img src={vaiImg} alt="vai" />
            {format(availableVai.dp(4, 1).toString(10))} VAI
          </div>
        </div>
        <div className="total-item">
          <div className="prop">VAI Staked</div>
          <div className="flex align-center value">
            <img src={vaiImg} alt="vai" />
            {format(vaiStaked.dp(4, 1).toString(10))} VAI
          </div>
        </div>
        <div className="total-item">
          <div className="prop">Available VAI rewards</div>
          <div className="flex align-center just-between value">
            <p>
              <img src={xvsImg} alt="xvs" />
              {format(vaiReward)} XVS
            </p>
            <p
              className={`pointer claim-btn ${
                isLoading || vaiReward === '0' ? 'disable-btn' : ''
              }`}
              onClick={handleClaimReward}
            >
              {isLoading && <Icon type="loading" />} Claim
            </p>
          </div>
        </div>
        <div className="total-item">
          <div className="prop">Venus Balance</div>
          <div className="flex align-center just-between value">
            <p>
              <img src={xvsImg} alt="xvs" />
              {format(userXVSBalance)} XVS
            </p>
          </div>
        </div>
      </UserInfoWrapper>
    </Card>
  );
}

UserInfo.propTypes = {
  availableVai: PropTypes.object.isRequired,
  vaiStaked: PropTypes.object.isRequired,
  vaiReward: PropTypes.string.isRequired
};

export default UserInfo;
