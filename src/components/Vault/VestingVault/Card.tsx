// Vesting vaults have a vesting time for users to withdraw their rewards after unstaking
import React, { useState } from 'react';
import { Row, Col } from 'antd';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { Icon, IconName } from 'components';
import { formatCommaThousandsPeriodDecimal, format } from 'utilities/common';
import { TokenId } from 'types';
import VaultCardContent from './CardContent';
import { VaultCardWrapper } from '../styles';

interface VaultCardProps {
  poolId: BigNumber;
  stakedToken: TokenId;
  rewardToken: TokenId;
  userStakedAmount: BigNumber;
  pendingReward: BigNumber;
  lockPeriodSecond: BigNumber;
  apr: BigNumber;
  totalStaked: BigNumber;
  dailyEmission: BigNumber;
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
  dailyEmission,
}: VaultCardProps) {
  const stakedTokenDecimal = new BigNumber(10).pow(getToken(stakedToken).decimals);
  const rewardTokenDecimal = new BigNumber(10).pow(getToken(rewardToken).decimals);
  const [expanded, setExpanded] = useState(false);
  return (
    <VaultCardWrapper>
      <div className={`header-container ${expanded ? '' : 'fold'}`}>
        <Row className="header">
          <Col className="col-item" lg={{ span: 2 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Stake</div>
            <div className="content">
              <Icon name={stakedToken.toLowerCase() as IconName} />
              <span>{stakedToken.toUpperCase()}</span>
            </div>
          </Col>
          <Col className="col-item" lg={{ span: 2 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Earn</div>
            <div className="content">
              <Icon name={rewardToken.toLowerCase() as IconName} />
              <span>{rewardToken.toUpperCase()}</span>
            </div>
          </Col>
          <Col className="col-item" lg={{ span: 4 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Available Rewards</div>
            <div className="content">
              {formatCommaThousandsPeriodDecimal(pendingReward.div(rewardTokenDecimal).toFixed(4))}
            </div>
          </Col>
          <Col className="col-item" lg={{ span: 5 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">{stakedToken.toUpperCase()} Staking APR</div>
            <div className="content">{format(apr.multipliedBy(100), 6)}%</div>
          </Col>
          <Col className="col-item" lg={{ span: 5 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Total {stakedToken.toUpperCase()} Staked</div>
            <div className="content">{format(totalStaked.div(stakedTokenDecimal), 4)}</div>
          </Col>
          <Col className="col-item" lg={{ span: 5 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">{rewardToken.toUpperCase()} Daily Emission</div>
            <div className="content">
              {format(dailyEmission.div(rewardTokenDecimal), 4)} {rewardToken.toUpperCase()}
            </div>
          </Col>
          <Col
            className="col-item expand-icon-wrapper"
            lg={{ span: 1 }}
            xs={{ span: 24 }}
            onClick={() => setExpanded(!expanded)}
          >
            <Icon className="expand-icon" name="arrowDown" />
          </Col>
        </Row>
      </div>
      <div>
        {expanded && (
          <VaultCardContent
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ className: string; poolId: any; stakedToke... Remove this comment to see the full error message
            className="content-container"
            poolId={poolId}
            stakedToken={stakedToken}
            rewardToken={rewardToken}
            userStakedAmount={userStakedAmount}
            pendingReward={pendingReward}
            lockPeriodSecond={lockPeriodSecond}
          />
        )}
      </div>
    </VaultCardWrapper>
  );
}

export default VaultCard;
