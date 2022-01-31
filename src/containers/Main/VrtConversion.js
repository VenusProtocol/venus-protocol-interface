/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import MainLayout from 'containers/Layout/MainLayout';
import { useWeb3React } from '@web3-react/core';
import { Row, Col } from 'antd';
import LoadingSpinner from '../../components/Basic/LoadingSpinner';
import useRefresh from '../../hooks/useRefresh';
import * as constants from '../../utilities/constants';
import { getVrtConverterAddress } from '../../utilities/addressHelpers';
import Redeem from '../../components/VrtConversion/Redeem';
import Withdraw from '../../components/VrtConversion/Withdraw';
import TabContainer from '../../components/Basic/TabContainer';
import {
  useVrtConverter,
  useVrtToken,
  useXvsVesting,
  useToken
} from '../../hooks/useContract';

const VrtConversionWrapper = styled.div`
  margin: 16px;
  display: flex;
  color: #fff;
  .vrt-conversion-container {
    width: 100%;
  }
  .title {
    font-size: 40px;
    line-height: 47px;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;
  }
`;

const VRT_DECIMAL = new BigNumber(10).pow(
  constants.CONTRACT_TOKEN_ADDRESS.vrt.decimals
);
const XVS_DECIMAL = new BigNumber(10).pow(
  constants.CONTRACT_TOKEN_ADDRESS.xvs.decimals
);
const CONVERSION_RATIO_DECIMAL = new BigNumber(10).pow(18);

export function VrtConversion() {
  // contract data
  const [redeemableAmount, setRedeemableAmount] = useState(new BigNumber(0));
  const [dailyUtilisation, setDailyUtilisation] = useState(new BigNumber(0));
  const [vrtDailyLimit, setVrtDailyLimit] = useState(new BigNumber(0));
  // eslint-disable-next-line no-unused-vars
  const [numberOfDaysSinceStart, setMumberOfDaysSinceStart] = useState(
    new BigNumber(0)
  );
  const [conversionRatio, setConversionRatio] = useState(new BigNumber(0));
  const [conversionEndTime, setConversionEndTime] = useState(new BigNumber(0));
  const [userVrtBalance, setUserVrtBalance] = useState(new BigNumber(0));
  const [vrtConverterXvsBalance, setVrtConverterXvsBalance] = useState(
    new BigNumber(0)
  );
  // user's allowance to VRT converter contracr
  const [userEnabled, setUserEnabled] = useState(false);

  // UI
  const [loading, setLoading] = useState(true);

  // account
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();

  // contracts
  const vrtConverterContract = useVrtConverter();
  const xvsVestingContract = useXvsVesting();
  const vrtTokenContract = useVrtToken();
  const xvsTokenContract = useToken('xvs');

  useEffect(async () => {
    let mounted = true;

    // fetch infos
    const [
      {
        redeemableAmount: redeemableAmountTemp,
        dailyUtilisation: dailyUtilisationTemp,
        vrtDailyLimit: vrtDailyLimitTemp,
        numberOfDaysSinceStart: numberOfDaysSinceStartTemp
      },
      conversionRatioTemp,
      conversionEndTimeTemp,
      userVrtBalanceTemp,
      userVrtAllowanceTemp,
      vrtConverterXvsBalanceTemp
    ] = await Promise.all([
      vrtConverterContract.methods
        .computeRedeemableAmountAndDailyUtilisation()
        .call(),
      vrtConverterContract.methods.conversionRatio().call(),
      vrtConverterContract.methods.conversionEndTime().call(),
      account
        ? vrtTokenContract.methods.balanceOf(account).call()
        : Promise.resolve(0),
      account
        ? vrtTokenContract.methods
            .allowance(account, getVrtConverterAddress())
            .call()
        : Promise.resolve(0),
      xvsTokenContract.methods
        .balanceOf(vrtConverterContract.options.address)
        .call()
    ]);

    if (mounted) {
      setLoading(false);
      setRedeemableAmount(new BigNumber(redeemableAmountTemp).div(VRT_DECIMAL));
      setDailyUtilisation(new BigNumber(dailyUtilisationTemp).div(VRT_DECIMAL));
      setVrtDailyLimit(new BigNumber(vrtDailyLimitTemp).div(VRT_DECIMAL));
      setMumberOfDaysSinceStart(new BigNumber(numberOfDaysSinceStartTemp));
      setConversionRatio(
        new BigNumber(conversionRatioTemp).div(CONVERSION_RATIO_DECIMAL)
      );
      setConversionEndTime(new BigNumber(conversionEndTimeTemp)); // in seconds
      setUserVrtBalance(new BigNumber(userVrtBalanceTemp).div(VRT_DECIMAL));
      setUserEnabled(new BigNumber(userVrtAllowanceTemp).gt(0));
      setVrtConverterXvsBalance(
        new BigNumber(vrtConverterXvsBalanceTemp).div(XVS_DECIMAL)
      );
    }

    return () => {
      mounted = false;
    };
  }, [fastRefresh, account]);

  return (
    <MainLayout title="Redeem VRT">
      {loading && <LoadingSpinner />}
      {!loading && (
        <VrtConversionWrapper>
          <Row className="vrt-conversion-container">
            <Col
              xl={{ span: 8, offset: 8 }}
              lg={{ span: 12, offset: 6 }}
              md={{ span: 12, offset: 6 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <div className="container">
                <TabContainer
                  styles={{
                    padding: `10%`,
                    marginTop: '24px'
                  }}
                  titles={['Redeem', 'Withdraw']}
                >
                  <Redeem
                    vrtConverterXvsBalance={vrtConverterXvsBalance}
                    redeemableAmount={redeemableAmount}
                    vrtConversionDailyLimit={vrtDailyLimit}
                    vrtDailyUtilised={dailyUtilisation}
                    userVrtBalance={userVrtBalance}
                    userEnabled={userEnabled}
                    conversionEndTime={conversionEndTime}
                    conversionRatio={conversionRatio}
                    handleClickRedeem={async redeemAmount => {
                      try {
                        if (!userEnabled && account) {
                          // approve user's allownace to converter
                          await vrtTokenContract.methods
                            .approve(
                              vrtConverterContract.options.address,
                              new BigNumber(2)
                                .pow(256)
                                .minus(1)
                                .toFixed()
                            )
                            .send({
                              from: account
                            });
                        } else {
                          await vrtConverterContract.methods
                            .convert(redeemAmount.times(VRT_DECIMAL).toFixed())
                            .send({
                              from: account
                            });
                        }
                      } catch (e) {
                        console.log('>> redeem error', e);
                      }
                    }}
                    account={account}
                  />
                  <Withdraw
                    withdrawableAmount={new BigNumber(0)}
                    handleClickWithdraw={() => {
                      xvsVestingContract.methods.withdraw(account);
                    }}
                  />
                </TabContainer>
              </div>
            </Col>
          </Row>
        </VrtConversionWrapper>
      )}
    </MainLayout>
  );
}
