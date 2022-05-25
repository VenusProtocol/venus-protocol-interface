// We put the code of UI of old VAI pool (which will be live for quite some time) into this seperated
// file, instead of merging its logic into general pool UI which is in `./Card.js` thus we can easily
// remove this VAI pool code in the future when it's about to be deprecated
import React, { useState } from 'react';

import { Row, Col } from 'antd';
import BigNumber from 'bignumber.js';
import { Icon, IconName } from 'components';
import { formatCommaThousandsPeriodDecimal } from 'utilities/common';
import { TokenId } from 'types';

interface CardHeaderProps {
  stakedToken: Uppercase<TokenId>;
  rewardToken: Uppercase<TokenId>;
  apy: string | number;
  totalStakedAmount: BigNumber;
  userPendingReward: BigNumber;
  dailyEmission: BigNumber;
  onExpand: () => void;
}

const CardHeader = ({
  stakedToken,
  rewardToken,
  apy,
  totalStakedAmount,
  userPendingReward,
  dailyEmission,
  onExpand,
}: CardHeaderProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`header-container ${expanded ? '' : 'fold'}`}>
      <Row className="header">
        <Col className="col-item" lg={{ span: 2 }} md={{ span: 6 }} xs={{ span: 12 }}>
          <div className="title">Stake</div>
          <div className="content">
            <Icon name={stakedToken.toLowerCase() as IconName} />
            <span>{stakedToken}</span>
          </div>
        </Col>
        <Col className="col-item" lg={{ span: 2 }} md={{ span: 6 }} xs={{ span: 12 }}>
          <div className="title">Earn</div>
          <div className="content">
            <Icon name={rewardToken.toLowerCase() as IconName} />
            <span>{rewardToken}</span>
          </div>
        </Col>
        <Col className="col-item" lg={{ span: 4 }} md={{ span: 6 }} xs={{ span: 12 }}>
          <div className="title">Available Rewards</div>
          <div className="content">
            {formatCommaThousandsPeriodDecimal(userPendingReward.dp(4, 1).toFixed())} {rewardToken}
          </div>
        </Col>
        <Col className="col-item" lg={{ span: 5 }} md={{ span: 6 }} xs={{ span: 12 }}>
          <div className="title">{stakedToken} Staking APR</div>
          <div className="content">{apy}%</div>
        </Col>
        <Col className="col-item" lg={{ span: 5 }} md={{ span: 6 }} xs={{ span: 12 }}>
          <div className="title">Total {stakedToken} Staked</div>
          <div className="content">
            {formatCommaThousandsPeriodDecimal(totalStakedAmount.dp(4, 1).toFixed())} {stakedToken}
          </div>
        </Col>
        <Col className="col-item" lg={{ span: 5 }} md={{ span: 6 }} xs={{ span: 12 }}>
          <div className="title">{rewardToken} Daily Emission</div>
          <div className="content">
            {formatCommaThousandsPeriodDecimal(dailyEmission.toFixed())} {rewardToken}
          </div>
        </Col>
        <Col
          className="col-item expand-icon-wrapper"
          lg={{ span: 1 }}
          xs={{ span: 24 }}
          onClick={() => {
            setExpanded(!expanded);
            onExpand();
          }}
        >
          <Icon className="expand-icon" name="arrowDown" />
        </Col>
      </Row>
    </div>
  );
};

export default CardHeader;
