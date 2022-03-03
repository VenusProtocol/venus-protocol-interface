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
import Convert from '../../components/VrtConversion/Convert';
import Withdraw from '../../components/VrtConversion/Withdraw';
import TabContainer from '../../components/Basic/TabContainer';
import { useVrtConverter, useVrtToken, useXvsVesting, useToken } from '../../hooks/useContract';

const VrtConversionWrapper = styled.div`
  margin: 16px;
  display: flex;
  color: #fff;
  .vrt-conversion-container {
    width: 100%;
  }
  .vrt-conversion-tab-container {
    border-radius: 8px;
  }
  .title {
    font-size: 40px;
    line-height: 47px;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;
  }
`;

const VRT_DECIMAL = new BigNumber(10).pow(constants.CONTRACT_TOKEN_ADDRESS.vrt.decimals);
const XVS_DECIMAL = new BigNumber(10).pow(constants.CONTRACT_TOKEN_ADDRESS.xvs.decimals);
const CONVERSION_RATIO_DECIMAL = new BigNumber(10).pow(18);

export default () => {
  // contract data
  const [withdrawableAmount, setWithdrawableAmount] = useState(new BigNumber(0));
  const [conversionRatio, setConversionRatio] = useState(new BigNumber(0));
  const [conversionEndTime, setConversionEndTime] = useState(new BigNumber(0));
  const [userVrtBalance, setUserVrtBalance] = useState(new BigNumber(0));
  const [xvsVestingXvsBalance, setXvsVestingXvsBalance] = useState(new BigNumber(0));
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

  useEffect(() => {
    let mounted = true;
    const update = async () => {
      const [
        {
          totalWithdrawableAmount: totalWithdrawableAmountTemp,
          totalVestedAmount: totalVestedAmountTemp,
          totalWithdrawnAmount: totalWithdrawnAmountTemp,
        },
        conversionRatioTemp,
        conversionEndTimeTemp,
        userVrtBalanceTemp,
        userVrtAllowanceTemp,
        xvsVestingXvsBalanceTemp,
      ] = await Promise.all([
        account
          ? xvsVestingContract.methods.getWithdrawableAmount(account).call()
          : Promise.resolve({
              totalWithdrawableAmount: '0',
              totalVestedAmount: '0',
              totalWithdrawnAmount: '0',
            }),
        // fetch infos
        vrtConverterContract.methods.conversionRatio().call(),
        vrtConverterContract.methods.conversionEndTime().call(),
        account ? vrtTokenContract.methods.balanceOf(account).call() : Promise.resolve(0),
        account
          ? vrtTokenContract.methods.allowance(account, getVrtConverterAddress()).call()
          : Promise.resolve(0),
        xvsTokenContract.methods.balanceOf(xvsVestingContract.options.address).call(),
      ]);
      if (mounted) {
        setLoading(false);
        setWithdrawableAmount(new BigNumber(totalWithdrawableAmountTemp).div(VRT_DECIMAL));
        setConversionRatio(new BigNumber(conversionRatioTemp).div(CONVERSION_RATIO_DECIMAL));
        setConversionEndTime(new BigNumber(conversionEndTimeTemp)); // in seconds
        setUserVrtBalance(new BigNumber(userVrtBalanceTemp).div(VRT_DECIMAL));
        setUserEnabled(new BigNumber(userVrtAllowanceTemp).gt(0));
        setXvsVestingXvsBalance(new BigNumber(xvsVestingXvsBalanceTemp).div(XVS_DECIMAL));
      }
    };

    update();

    return () => {
      mounted = false;
    };
  }, [fastRefresh, account]);

  return (
    <MainLayout title="Convert VRT">
      {loading ? (
        <LoadingSpinner />
      ) : (
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
                  className="vrt-conversion-tab-container"
                  titles={['Convert', 'Withdraw']}
                >
                  <Convert
                    xvsVestingXvsBalance={xvsVestingXvsBalance}
                    userVrtBalance={userVrtBalance}
                    userEnabled={userEnabled}
                    conversionEndTime={conversionEndTime}
                    conversionRatio={conversionRatio}
                    handleClickConvert={async convertAmount => {
                      try {
                        if (!userEnabled && account) {
                          // approve user's VRT allownace to converter
                          await vrtTokenContract.methods
                            .approve(
                              vrtConverterContract.options.address,
                              new BigNumber(2).pow(256).minus(1).toFixed(),
                            )
                            .send({
                              from: account,
                            });
                        } else {
                          await vrtConverterContract.methods
                            .convert(convertAmount.times(VRT_DECIMAL).toFixed())
                            .send({
                              from: account,
                            });
                        }
                      } catch (e) {
                        console.log('>> convert error', e);
                      }
                    }}
                    account={account || ''}
                  />
                  <Withdraw
                    withdrawableAmount={withdrawableAmount}
                    handleClickWithdraw={async () => {
                      try {
                        await xvsVestingContract.methods.withdraw().send({
                          from: account,
                        });
                      } catch (e) {
                        console.log('>> withdraw error', e);
                      }
                    }}
                    account={account || ''}
                  />
                </TabContainer>
              </div>
            </Col>
          </Row>
        </VrtConversionWrapper>
      )}
    </MainLayout>
  );
};
