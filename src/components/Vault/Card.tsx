import React, { useState } from 'react';
import { Row, Col } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import commaNumber from 'comma-number';
import * as constants from 'utilities/constants';
import VaultCardContent from './CardContent';
import { VaultCardWrapper } from './styles';

import vaiImg from '../../assets/img/coins/vai.svg';
import xvsImg from '../../assets/img/coins/xvs.png';
import arrowDownImg from '../../assets/img/arrow-down.png';

const commaFormatter = commaNumber.bindWith(',', '.');

function getTokenImg(name) {
  return {
    xvs: xvsImg,
    vai: vaiImg
  }[name];
}

function VaultCard({
  poolId,
  stakedToken,
  rewardToken,
  userStakedAmount,
  pendingReward,
  lockPeriodSecond,
  apr,
  totalStaked,
  dailyEmission
}) {
  const stakedTokenDecimal = new BigNumber(10).pow(
    constants.CONTRACT_TOKEN_ADDRESS[stakedToken].decimals
  );
  const rewardTokenDecimal = new BigNumber(10).pow(
    constants.CONTRACT_TOKEN_ADDRESS[rewardToken].decimals
  );
  const [expanded, setExpanded] = useState(false);
  return (
    <VaultCardWrapper>
      <div className={`header-container ${expanded ? '' : 'fold'}`}>
        <Row className="header">
          <Col
            className="col-item"
            lg={{ span: 3 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">Stake</div>
            <div className="content">
              <img src={getTokenImg(stakedToken)} alt="stakedToken" />
              <span>{stakedToken.toUpperCase()}</span>
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 3 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">Earn</div>
            <div className="content">
              <img src={getTokenImg(rewardToken)} alt="rewardToken" />
              <span>{rewardToken.toUpperCase()}</span>
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">Available Rewards</div>
            <div className="content">
              {commaFormatter(pendingReward.div(rewardTokenDecimal).toFixed(4))}
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">{stakedToken.toUpperCase()} Staking APR</div>
            <div className="content">
              {commaFormatter(
                apr
                  .multipliedBy(100)
                  .dp(6, 1)
                  .toString(10)
              )}
              %
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">
              Total {stakedToken.toUpperCase()} Staked
            </div>
            <div className="content">
              {commaFormatter(
                totalStaked
                  .div(stakedTokenDecimal)
                  .dp(4, 1)
                  .toString(10)
              )}
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">
              {rewardToken.toUpperCase()} Daily Emission
            </div>
            <div className="content">
              {commaFormatter(
                dailyEmission
                  .div(rewardTokenDecimal)
                  .dp(4, 1)
                  .toString(10)
              )}{' '}
              {rewardToken.toUpperCase()}
            </div>
          </Col>
          <Col
            className="col-item expand-icon-wrapper"
            lg={{ span: 2 }}
            xs={{ span: 24 }}
            onClick={() => setExpanded(!expanded)}
          >
            <img className="expand-icon" alt="open" src={arrowDownImg} />
          </Col>
        </Row>
      </div>
      <div>
        {expanded ? (
          <VaultCardContent
            className="content-container"
            poolId={poolId}
            stakedToken={stakedToken}
            rewardToken={rewardToken}
            userStakedAmount={userStakedAmount}
            pendingReward={pendingReward}
            lockPeriodSecond={lockPeriodSecond}
          />
        ) : null}
      </div>
    </VaultCardWrapper>
  );
}

VaultCard.propTypes = {
  poolId: PropTypes.instanceOf(BigNumber).isRequired,
  stakedToken: PropTypes.string.isRequired,
  rewardToken: PropTypes.string.isRequired,
  userStakedAmount: PropTypes.instanceOf(BigNumber).isRequired,
  pendingReward: PropTypes.instanceOf(BigNumber).isRequired,
  lockPeriodSecond: PropTypes.instanceOf(BigNumber).isRequired,
  apr: PropTypes.instanceOf(BigNumber).isRequired,
  totalStaked: PropTypes.instanceOf(BigNumber).isRequired,
  dailyEmission: PropTypes.instanceOf(BigNumber).isRequired
};

export default VaultCard;
