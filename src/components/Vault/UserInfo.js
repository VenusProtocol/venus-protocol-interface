import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { Icon } from 'antd';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import { connectAccount } from 'core';
import {
  getTokenContract,
  getVaiVaultContract,
  methods
} from 'utilities/ContractService';
import { checkIsValidNetwork } from 'utilities/common';
import { Card } from 'components/Basic/Card';
import vaiImg from 'assets/img/coins/vai.svg';
import xvsImg from 'assets/img/venus_32.png';

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
const abortController = new AbortController();

function UserInfo({ settings, availableVai, vaiStaked, vaiReward }) {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('');

  const updateBalance = useCallback(async () => {
    if (settings.selectedAddress) {
      const xvsTokenContract = getTokenContract('xvs');
      let temp = await methods.call(xvsTokenContract.methods.balanceOf, [
        settings.selectedAddress
      ]);
      temp = new BigNumber(temp)
        .dividedBy(new BigNumber(10).pow(18))
        .dp(4, 1)
        .toString(10);
      setBalance(temp);
    }
  }, [settings.markets]);

  const handleClaimReward = async () => {
    if (isLoading || vaiReward === '0') return;
    const appContract = getVaiVaultContract();
    setIsLoading(true);
    await methods
      .send(appContract.methods.claim, [], settings.selectedAddress)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (checkIsValidNetwork()) {
      updateBalance();
    }
    return function cleanup() {
      abortController.abort();
    };
  }, [settings.selectedAddress, updateBalance]);

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
              {format(balance)} XVS
            </p>
          </div>
        </div>
      </UserInfoWrapper>
    </Card>
  );
}

UserInfo.propTypes = {
  settings: PropTypes.object
};

UserInfo.defaultProps = {
  settings: {}
};

UserInfo.propTypes = {
  availableVai: PropTypes.object.isRequired,
  vaiStaked: PropTypes.object.isRequired,
  vaiReward: PropTypes.string.isRequired
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(UserInfo);
