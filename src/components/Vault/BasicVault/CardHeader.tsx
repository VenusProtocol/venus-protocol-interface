// We put the code of UI of old VAI pool (which will be live for quite some time) into this seperated
// file, instead of merging its logic into general pool UI which is in `./Card.js` thus we can easily
// remove this VAI pool code in the future when it's about to be deprecated
import React, { useState, useEffect } from 'react';

import { Row, Col } from 'antd';
import BigNumber from 'bignumber.js';
import commaNumber from 'comma-number';
import vaiImg from 'assets/img/coins/vai.svg';
import xvsImg from 'assets/img/coins/xvs.png';
import arrowDownImg from 'assets/img/arrow-down.png';

const commaFormatter = commaNumber.bindWith(',', '.');

interface CardHeaderProps {
    stakedToken: string;
    rewardToken: string;
    apy: string | number;
    totalStakedAmount: BigNumber;
    totalPendingRewards: BigNumber;
    dailyEmission: BigNumber;
    onExpand: () => void;
  }

const CardHeader = ({
    stakedToken,
    rewardToken,
    apy,
    totalStakedAmount,
    totalPendingRewards,
    dailyEmission,
    onExpand,
}: CardHeaderProps) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className={`header-container ${expanded ? '' : 'fold'}`}>
        <Row className="header">
          <Col className="col-item" lg={{ span: 3 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Stake</div>
            <div className="content">
              <img src={vaiImg} alt={stakedToken} />
              <span>{stakedToken}</span>
            </div>
          </Col>
          <Col className="col-item" lg={{ span: 3 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Earn</div>
            <div className="content">
              <img src={xvsImg} alt="rewardToken" />
              <span>{rewardToken}</span>
            </div>
          </Col>
          <Col className="col-item" lg={{ span: 4 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Reward Pool</div>
            <div className="content">
              {commaFormatter(
            totalPendingRewards
              .div(1e18)
              .dp(4, 1)
              .toString(10),
          )}{' '}
              XVS
            </div>
          </Col>
          <Col className="col-item" lg={{ span: 4 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">{stakedToken} Staking APR</div>
            <div className="content">{apy}%</div>
          </Col>
          <Col className="col-item" lg={{ span: 4 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">Total {stakedToken} Staked</div>
            <div className="content">
              {commaFormatter(totalStakedAmount.dp(4, 1).toString(10))}
              {stakedToken}
            </div>
          </Col>
          <Col className="col-item" lg={{ span: 4 }} md={{ span: 6 }} xs={{ span: 12 }}>
            <div className="title">{rewardToken} Daily Emission</div>
            <div className="content">{commaFormatter(dailyEmission.toString(10))} XVS</div>
          </Col>
          <Col
            className="col-item expand-icon-wrapper"
            lg={{ span: 2 }}
            xs={{ span: 24 }}
            onClick={() => {
                setExpanded(!expanded);
                onExpand();
            }}
          >
            <img className="expand-icon" alt="open" src={arrowDownImg} />
          </Col>
        </Row>
      </div>
);
};

export default CardHeader;
