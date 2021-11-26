// We put the code of UI of old VAI pool (which will be live for quite some time) into this seperated
// file, instead of merging its logic into general pool UI which is in `./Card.js` thus we can easily
// remove this VAI pool code in the future when it's about to be deprecated
import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import { Row, Col } from 'antd';
import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import commaNumber from 'comma-number';
import { connectAccount } from 'core';
import { useWeb3React } from '@web3-react/core';
import VAICardContent from './VaiCardContent';
import { VaultCardWrapper } from './styles';
import useRefresh from '../../hooks/useRefresh';
import {
  useComptroller,
  useToken,
  useVaiToken,
  useVaiVault
} from '../../hooks/useContract';

import vaiImg from '../../assets/img/coins/vai.svg';
import xvsImg from '../../assets/img/coins/xvs.png';
import arrowDownImg from '../../assets/img/arrow-down.png';
import { getVaiVaultAddress } from '../../utilities/addressHelpers';

const commaFormatter = commaNumber.bindWith(',', '.');

function VaultCard({ settings }) {
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();

  const compContract = useComptroller();
  const xvsTokenContract = useToken('xvs');
  const vaiTokenContract = useVaiToken();
  const vaultContract = useVaiVault();

  const [expanded, setExpanded] = useState(false);
  const [dailyEmission, setDailyEmission] = useState(new BigNumber(0));
  const [totalPendingRewards, setTotalPendingRewards] = useState(
    new BigNumber(0)
  );
  const [userVaiAllowance, setUserVaiAllowance] = useState(new BigNumber(0));
  const [userVaiStakedAmount, setUserVaiStakedAmount] = useState(
    new BigNumber(0)
  );
  const [userVaiBalance, setUserVaiBalance] = useState(new BigNumber(0));
  const [userPendingReward, setUserPendingReward] = useState(new BigNumber(0));

  useEffect(async () => {
    let isMounted = true;

    let userVaiBalanceTemp = new BigNumber(0);
    let userVaiStakedAmountTemp = new BigNumber(0);
    let userPendingRewardTemp = new BigNumber(0);
    let userVaiAllowanceTemp = new BigNumber(0);

    const [venusVAIVaultRateTemp, totalPendingRewardsTemp] = await Promise.all([
      compContract.methods.venusVAIVaultRate().call(),
      xvsTokenContract.methods.balanceOf(getVaiVaultAddress()).call()
    ]);

    if (account) {
      [
        userVaiBalanceTemp,
        { 0: userVaiStakedAmountTemp },
        userPendingRewardTemp,
        userVaiAllowanceTemp
      ] = await Promise.all([
        vaiTokenContract.methods.balanceOf(account).call(),
        vaultContract.methods.userInfo(account).call(),
        vaultContract.methods.pendingXVS(account).call(),
        vaiTokenContract.methods.allowance(account, getVaiVaultAddress()).call()
      ]);
    }

    if (isMounted) {
      // total info
      const blockPerMinute = 60 / 3;
      const blockPerDay = blockPerMinute * 60 * 24;
      setDailyEmission(
        new BigNumber(venusVAIVaultRateTemp)
          .div(1e18)
          .multipliedBy(blockPerDay)
          .dp(2, 1)
      );
      setTotalPendingRewards(new BigNumber(totalPendingRewardsTemp));
      setUserVaiBalance(new BigNumber(userVaiBalanceTemp));
      setUserVaiStakedAmount(new BigNumber(userVaiStakedAmountTemp));
      setUserPendingReward(new BigNumber(userPendingRewardTemp));
      setUserVaiAllowance(new BigNumber(userVaiAllowanceTemp));
    }

    return () => {
      isMounted = false;
    };
  }, [fastRefresh, account]);

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
              <img src={vaiImg} alt="Vai" />
              <span>VAI</span>
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
              <img src={xvsImg} alt="rewardToken" />
              <span>XVS</span>
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">Reward Pool</div>
            <div className="content">
              {commaFormatter(
                totalPendingRewards
                  .div(1e18)
                  .dp(4, 1)
                  .toString(10)
              )}{' '}
              XVS
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">VAI Staking APY</div>
            <div className="content">{settings.vaiAPY}%</div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">Total VAI Staked</div>
            <div className="content">
              {settings.vaultVaiStaked
                ? commaFormatter(
                    new BigNumber(settings.vaultVaiStaked).dp(4, 1).toString(10)
                  )
                : 0}{' '}
              VAI
            </div>
          </Col>
          <Col
            className="col-item"
            lg={{ span: 4 }}
            md={{ span: 6 }}
            xs={{ span: 12 }}
          >
            <div className="title">XVS Daily Emission</div>
            <div className="content">
              {commaFormatter(dailyEmission.toString(10))} XVS
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
      <div className="content-container">
        {expanded ? (
          <VAICardContent
            userPendingReward={userPendingReward}
            userVaiBalance={userVaiBalance}
            userVaiAllowance={userVaiAllowance}
            userVaiStakedAmount={userVaiStakedAmount}
          />
        ) : null}
      </div>
    </VaultCardWrapper>
  );
}

VaultCard.propTypes = {
  settings: PropTypes.object.isRequired
};

VaultCard.defaultProps = {};

const mapStateToProps = ({ account }) => ({
  settings: account.setting
});

export default compose(connectAccount(mapStateToProps, undefined))(VaultCard);
