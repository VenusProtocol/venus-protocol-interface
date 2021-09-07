import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { compose } from 'recompose';
import { connectAccount } from 'core';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import {
  getVaiVaultContract,
  getVaiTokenContract,
  methods
} from 'utilities/ContractService';
import { Card } from 'components/Basic/Card';
import NumberFormat from 'react-number-format';
import Button from '@material-ui/core/Button';
import * as constants from 'utilities/constants';
import xvsImg from 'assets/img/venus_32.png';

const StakingWrapper = styled.div`
  width: 100%;
  border-radius: 25px;
  background-color: var(--color-bg-primary);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  .stake-section {
    margin: 15px 0;
    padding: 30px 0;
    border-radius: 20px;
    background-color: var(--color-bg-main);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;

    .stake-info {
      font-weight: 500;
      font-size: 18px;
      color: var(--color-white);
    }

    .stake-warning {
      font-size: 15px;
      color: var(--color-text-secondary);
    }

    .stake-input {
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      margin-top: 15px;

      input {
        width: 65%;
        margin-left: 17.5%;
        border: none;
        height: 100%;
        font-size: 40px;
        color: var(--color-yellow);
        text-align: center;
        background: transparent;
        &:focus {
          outline: none;
        }
      }

      span {
        position: absolute;
        right: 25px;
        width: 12%;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        color: #bdbdbd;
        cursor: pointer;
      }
    }

    .button {
      width: 248px;
      height: 41px;
      border-radius: 5px;
      background-image: linear-gradient(to right, #f2c265, #f7b44f);
      margin-top: 15px;

      .MuiButton-label {
        font-size: 16px;
        font-weight: 500;
        color: var(--color-text-main);
        text-transform: capitalize;
      }
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
      margin-top: 15px;

      img {
        width: 24px;
        margin-right: 10px;
      }

      .claim-btn {
        font-size: 18px;
        font-weight: bold;
        color: var(--color-orange);
        margin-left: 30px;
      }
      .disable-btn {
        color: var(--color-text-secondary);
      }
    }
  }
`;

const format = commaNumber.bindWith(',', '.');

function Staking({
  settings,
  isEnabled,
  availableVai,
  vaiStaked,
  vaiReward,
  xvsBalance,
  updateTotalInfo
}) {
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isStakeLoading, setIsStakeLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  /**
   * Stake VAI
   */
  const handleStakeVAI = () => {
    const appContract = getVaiVaultContract();
    setIsStakeLoading(true);
    methods
      .send(
        appContract.methods.deposit,
        [
          stakeAmount
            .times(1e18)
            .integerValue()
            .toString(10)
        ],
        settings.selectedAddress
      )
      .then(() => {
        updateTotalInfo();
        setStakeAmount(new BigNumber(0));
        setIsStakeLoading(false);
      })
      .catch(() => {
        setIsStakeLoading(false);
      });
  };

  /**
   * Withdraw VAI
   */
  const handleWithdrawVAI = () => {
    const appContract = getVaiVaultContract();
    setIsWithdrawLoading(true);
    methods
      .send(
        appContract.methods.withdraw,
        [
          withdrawAmount
            .times(1e18)
            .integerValue()
            .toString(10)
        ],
        settings.selectedAddress
      )
      .then(() => {
        updateTotalInfo();
        setWithdrawAmount(new BigNumber(0));
        setIsWithdrawLoading(false);
      })
      .catch(() => {
        setIsWithdrawLoading(false);
      });
  };

  const onApprove = async () => {
    setIsStakeLoading(true);
    const vaiContract = getVaiTokenContract();
    methods
      .send(
        vaiContract.methods.approve,
        [
          constants.CONTRACT_VAI_VAULT_ADDRESS,
          new BigNumber(2)
            .pow(256)
            .minus(1)
            .toString(10)
        ],
        settings.selectedAddress
      )
      .then(() => {
        updateTotalInfo();
        setIsStakeLoading(false);
      })
      .catch(() => {
        setIsStakeLoading(false);
      });
  };

  const handleClaimReward = async () => {
    if (isClaimLoading || vaiReward === '0') return;
    const appContract = getVaiVaultContract();
    setIsClaimLoading(true);
    await methods
      .send(appContract.methods.claim, [], settings.selectedAddress)
      .then(() => {
        setIsClaimLoading(false);
      })
      .catch(() => {
        setIsClaimLoading(false);
      });
  };

  return (
    <Card>
      <StakingWrapper>
        <div className="stake-section">
          <div className="stake-info">
            Available VAI to stake: {format(availableVai.dp(4, 1).toString(10))}{' '}
            VAI
          </div>
          {!isEnabled ? (
            <p className="stake-warning">
              To stake VAI, you need to approve it first.
            </p>
          ) : (
            <div className="stake-input">
              <NumberFormat
                autoFocus
                value={stakeAmount.isZero() ? '' : stakeAmount.toString(10)}
                onValueChange={({ value }) => {
                  setStakeAmount(new BigNumber(value));
                }}
                isAllowed={({ value }) => {
                  return new BigNumber(value || 0).lte(availableVai);
                }}
                thousandSeparator
                allowNegative={false}
                placeholder="0"
              />
              <span onClick={() => setStakeAmount(availableVai)}>MAX</span>
            </div>
          )}
          {!isEnabled ? (
            <Button
              className="button"
              disabled={isStakeLoading}
              onClick={() => {
                onApprove();
              }}
            >
              {isStakeLoading && <Icon type="loading" />} Enable
            </Button>
          ) : (
            <Button
              className="button"
              disabled={
                isStakeLoading ||
                stakeAmount.isZero() ||
                stakeAmount.isNaN() ||
                stakeAmount.isGreaterThan(availableVai)
              }
              onClick={handleStakeVAI}
            >
              {isStakeLoading && <Icon type="loading" />} Stake
            </Button>
          )}
        </div>
        <div className="stake-section">
          <div className="stake-info">
            VAI staked: {format(vaiStaked.dp(4, 1).toString(10))} VAI
          </div>
          <div className="stake-input">
            <NumberFormat
              autoFocus
              value={withdrawAmount.isZero() ? '' : withdrawAmount.toString(10)}
              onValueChange={({ value }) => {
                setWithdrawAmount(new BigNumber(value));
              }}
              isAllowed={({ value }) => {
                return new BigNumber(value || 0).lte(vaiStaked);
              }}
              thousandSeparator
              allowNegative={false}
              placeholder="0"
            />
            <span onClick={() => setWithdrawAmount(vaiStaked)}>MAX</span>
          </div>
          <Button
            className="button"
            onClick={() => handleWithdrawVAI()}
            disabled={
              isWithdrawLoading ||
              withdrawAmount.isZero() ||
              withdrawAmount.isNaN() ||
              withdrawAmount.isGreaterThan(vaiStaked)
            }
          >
            {isWithdrawLoading && <Icon type="loading" />} Withdraw
          </Button>
        </div>
        <div className="stake-section">
          <div className="stake-info">
            Available VAI rewards:
          </div>
          <div className="flex align-center just-between value">
            <p>
              <img src={xvsImg} alt="xvs" />
              <span>{format(vaiReward)} XVS</span>
            </p>
            <p
              className={`pointer claim-btn ${
                isClaimLoading || vaiReward === '0' ? 'disable-btn' : ''
              }`}
              onClick={handleClaimReward}
            >
              {isClaimLoading && <Icon type="loading" />} Claim
            </p>
          </div>
        </div>
        <div className="stake-section">
          <div className="stake-info">Venus Balance:</div>
          <div className="flex align-center just-between value">
            <img src={xvsImg} alt="xvs" />
            <span>{format(xvsBalance)} XVS</span>
          </div>
        </div>
      </StakingWrapper>
    </Card>
  );
}

Staking.propTypes = {
  settings: PropTypes.object,
  isEnabled: PropTypes.bool.isRequired,
  availableVai: PropTypes.object.isRequired,
  vaiStaked: PropTypes.object.isRequired,
  vaiReward: PropTypes.object.isRequired,
  updateTotalInfo: PropTypes.func.isRequired,
  xvsBalance: PropTypes.string.isRequired
};

Staking.defaultProps = {
  settings: {}
};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(Staking);
